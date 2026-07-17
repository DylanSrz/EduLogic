import math

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db                              # ← Importación de la sesión de BD
from app.models.usuario import Usuario, RolUsuario           # ← Modelo de usuario y enum de roles
from app.schemas.usuario import (                            # ← Schemas de respuesta/petición
    CambioRol,                                               #   (agregados en Issue #21)
    PaginaUsuarios,
    UsuarioDetalleAdmin,
)
from app.services.dependencias import requiere_rol           # ← Dependencia de autorización por rol

router = APIRouter(prefix="/admin", tags=["Administración"])

# ---------------------------------------------------------------------------
# GET /admin/usuarios  —  Lista paginada de usuarios con filtro opcional por rol.
#
# PAGINACIÓN: sin ella, con miles de usuarios la respuesta sería gigante
# (memoria del servidor, ancho de banda, tiempo de respuesta). Se usa
# `pagina` y `tamanio` como query parameters. Valor por defecto: 20 por página.
# --------------------------------------------------------------------------

@router.get("/usuarios", response_model=PaginaUsuarios)
def listar_usuarios(
    pagina: int = Query(1, ge=1, description="Número de página (mínimo 1)"),           # ← Parámetro de paginación
    tamanio: int = Query(20, ge=1, le=100, description="Usuarios por página (1-100)"), # ← Tamaño de página con límite
    rol: str | None = Query(None, description="Filtrar por rol: estudiante, profesor, admin"),  # ← Filtro opcional
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(requiere_rol("admin")),  # ← Solo admin puede acceder; otros roles → 403
):
    """Lista usuarios con paginación y filtro opcional por rol.

    La paginación es necesaria porque, con miles de usuarios, devolver
    todos en una sola respuesta sería ineficiente y lento. El frontend
    puede solicitar páginas sucesivas con ?pagina=2&tamanio=20.
    """
    # ── Construir la consulta base ──
    consulta = db.query(Usuario)

    # ── Aplicar filtro por rol si se proporciona ──
    if rol:
        # Validar que el rol sea uno de los 3 roles válidos del sistema
        roles_validos = [r.value for r in RolUsuario]   # ← ["estudiante", "profesor", "admin"]
        if rol not in roles_validos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Rol inválido. Roles válidos: {', '.join(roles_validos)}.",
            )
        consulta = consulta.filter(Usuario.rol == rol)   # ← Filtro aplicado a la consulta

    # ── Calcular total de registros que coinciden ──
    total = consulta.count()

    # ── Calcular total de páginas ──
    total_paginas = math.ceil(total / tamanio) if total > 0 else 0   # ← Redondeo hacia arriba

    # ── Aplicar paginación con offset y limit ──
    offset = (pagina - 1) * tamanio                     # ← Desplazamiento: página 1 → offset 0
    usuarios = consulta.order_by(Usuario.id).offset(offset).limit(tamanio).all()

    return PaginaUsuarios(
        usuarios=usuarios,
        total=total,
        pagina=pagina,
        tamanio=tamanio,
        total_paginas=total_paginas,
    )


# ---------------------------------------------------------------------------
# GET /admin/usuarios/{id}  —  Detalle de un usuario (sin contraseña, como siempre).
# ---------------------------------------------------------------------------

@router.get("/usuarios/{usuario_id}", response_model=UsuarioDetalleAdmin)
def obtener_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(requiere_rol("admin")),  # ← Solo admin puede acceder; otros roles → 403
):
    """Devuelve el detalle de un usuario por su ID.

    La contraseña nunca se incluye en la respuesta (no está en el schema
    UsuarioDetalleAdmin). Se incluye el campo 'activo' para que el admin
    pueda ver si la cuenta está activa o desactivada.
    """
    usuario = db.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )
    return usuario


# ---------------------------------------------------------------------------
# PUT /admin/usuarios/{id}/rol  —  Cambia el rol de un usuario.
#
# Valida que el rol sea uno de los 3 roles válidos del sistema.
# REGLA DE AUTOPROTECCIÓN: un admin NO puede quitarse el rol admin a sí mismo.
# Sin esta regla, el sistema quedaría sin administrador.
# ---------------------------------------------------------------------------

@router.put("/usuarios/{usuario_id}/rol", response_model=UsuarioDetalleAdmin)
def cambiar_rol(
    usuario_id: int,
    datos: CambioRol,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(requiere_rol("admin")),  # ← Solo admin puede acceder; otros roles → 403
):
    """Cambia el rol de un usuario. El nuevo rol debe ser uno de los 3 válidos.

    Regla de autoprotección: un admin no puede quitarse el rol admin a sí mismo,
    porque eso dejaría el sistema sin administrador.
    """
    # ── Buscar el usuario objetivo ──
    usuario = db.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    # ── Regla de autoprotección: admin no puede autodegradarse ──
    if usuario.id == admin.id and datos.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes quitarte el rol de administrador a ti mismo.",  # ← Protección contra autodegradación
        )

    # ── Asignar el nuevo rol usando el enum RolUsuario ──
    usuario.rol = RolUsuario(datos.rol)                  # ← Conversión del string al enum válido
    db.commit()
    db.refresh(usuario)

    return usuario


# ---------------------------------------------------------------------------
# DELETE /admin/usuarios/{id}  —  Desactiva (borrado lógico) un usuario.
#
# DECISIÓN DE BORRADO (documentada en el PR):
# Se implementa BORRADO LÓGICO: se cambia activo=False en lugar de eliminar
# el registro de la base de datos. Motivos:
#   1. Conservar el historial: intentos, progreso y respuestas del estudiante
#      siguen siendo visibles. Con borrado físico, las llaves foráneas
#      (ON DELETE CASCADE) eliminarían todo ese historial.
#   2. Reversibilidad: si el admin desactiva por error, puede reactivar
#      la cuenta sin perder datos (solo cambiaría activo=True).
#   3. Auditoría: se mantiene el registro de quién fue dado de baja.
#
# REGLA DE AUTOPROTECCIÓN: un admin NO puede desactivarse a sí mismo.
# Sin esta regla, el sistema quedaría sin administrador.
# ---------------------------------------------------------------------------

@router.delete("/usuarios/{usuario_id}", response_model=UsuarioDetalleAdmin)
def desactivar_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(requiere_rol("admin")),  # ← Solo admin puede acceder; otros roles → 403
):
    """Desactiva un usuario (borrado lógico). El registro permanece en la BD
    pero el usuario no puede iniciar sesión (login devuelve 401).

    El usuario desactivado conserva todo su historial (intentos, progreso).
    """
    # ── Buscar el usuario objetivo ──
    usuario = db.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    # ── Regla de autoprotección: admin no puede autodesactivarse ──
    if usuario.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes desactivar tu propia cuenta de administrador.",  # ← Protección contra autodesactivación
        )

    # ── Verificar si ya está desactivado ──
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya está desactivado.",
        )

    # ── Borrado lógico: cambiar activo a False ──
    usuario.activo = False                                # ← No se elimina el registro, solo se desactiva
    db.commit()
    db.refresh(usuario)

    return usuario
