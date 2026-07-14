from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCrear, UsuarioRespuesta
from app.services.seguridad import hashear_contrasena

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/registro", response_model=UsuarioRespuesta, status_code=status.HTTP_201_CREATED)
def registrar_usuario(datos: UsuarioCrear, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario en la base de datos.

    Args:
        datos (UsuarioCrear): Datos del usuario a registrar.
        db (Session): Sesión de la base de datos.

    Returns:
        UsuarioRespuesta: Información del usuario registrado.
    """
    # Verificar si el email ya está registrado
    usuario_existente = db.query(Usuario).filter(
        Usuario.email == datos.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El email ya está registrado."
        )

    # Hashear la contraseña
    contrasena_hasheada = hashear_contrasena(datos.contrasena)

    # Crear el nuevo usuario
    nuevo_usuario = Usuario(
        nombre=datos.nombre,
        email=datos.email,
        contrasena_hash=contrasena_hasheada,
        rol=datos.rol
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario
