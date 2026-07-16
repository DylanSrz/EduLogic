from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.curso import Curso
from app.models.leccion import Leccion
from app.models.usuario import Usuario
from app.schemas.leccion import LeccionActualizar, LeccionCrear, LeccionRespuesta
from app.services.dependencias import requiere_rol, usuario_actual

# Sin prefix: las rutas viven en 2 familias (/cursos/... y /lecciones/...)
router = APIRouter(tags=["Lecciones"])


def verificar_propiedad(curso, usuario):
    """Admin puede todo; un profesor solo modifica las lecciones de sus propios cursos."""
    if usuario.rol.value != "admin" and curso.creador_id != usuario.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para modificar las lecciones de este curso.",
        )


def validar_orden_disponible(db, curso_id, orden, leccion_id=None):
    """Regla de negocio: no puede haber dos lecciones con el mismo orden en un curso.

    DECISION DOCUMENTADA (criterio de aceptacion de la issue): la API rechaza el
    orden duplicado con 409 en vez de reordenar automaticamente. Razones:
    - 409 es el codigo para conflictos con el estado actual del recurso, el mismo
      que usamos para el correo duplicado en el registro.
    - Reordenar en silencio moveria lecciones que el profesor no toco: sorpresa
      para el usuario y dificil de depurar.
    El UniqueConstraint uq_leccion_curso_orden del modelo respalda esta regla en
    la base de datos; aqui la verificamos antes para responder con mensaje claro.
    En el PUT se excluye a la propia leccion (leccion_id) para permitir guardar
    sin cambiar el orden.
    """
    consulta = db.query(Leccion).filter(
        Leccion.curso_id == curso_id, Leccion.orden == orden
    )
    if leccion_id is not None:
        consulta = consulta.filter(Leccion.id != leccion_id)
    if consulta.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe una lección con el orden {orden} en este curso.",
        )


# ---------------------------------------------------------------------------
# GET /cursos/{curso_id}/lecciones  -  Cualquier usuario autenticado.
# Siempre ordenadas por el campo `orden`: EduLogic guia paso a paso.
# ---------------------------------------------------------------------------
@router.get("/cursos/{curso_id}/lecciones", response_model=list[LeccionRespuesta])
def listar_lecciones(
    curso_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(usuario_actual),
):
    """Lista las lecciones de un curso ordenadas por su campo orden."""
    curso = db.get(Curso, curso_id)
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curso no encontrado.",
        )
    lecciones = (
        db.query(Leccion)
        .filter(Leccion.curso_id == curso_id)
        .order_by(Leccion.orden)
        .all()
    )
    return lecciones


# ---------------------------------------------------------------------------
# GET /lecciones/{leccion_id}  -  Cualquier usuario autenticado.
# ---------------------------------------------------------------------------
@router.get("/lecciones/{leccion_id}", response_model=LeccionRespuesta)
def obtener_leccion(
    leccion_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(usuario_actual),
):
    """Detalle de una leccion con su contenido de estudio completo."""
    leccion = db.get(Leccion, leccion_id)
    if not leccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada.",
        )
    return leccion


# ---------------------------------------------------------------------------
# POST /cursos/{curso_id}/lecciones  -  Solo el profesor dueño o un admin.
# ---------------------------------------------------------------------------
@router.post(
    "/cursos/{curso_id}/lecciones",
    response_model=LeccionRespuesta,
    status_code=status.HTTP_201_CREATED,
)
def crear_leccion(
    curso_id: int,
    datos: LeccionCrear,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Crea una leccion dentro de un curso. El curso_id sale de la URL."""
    curso = db.get(Curso, curso_id)
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curso no encontrado.",
        )

    verificar_propiedad(curso, usuario)
    validar_orden_disponible(db, curso_id, datos.orden)

    nueva_leccion = Leccion(
        curso_id=curso.id,
        titulo=datos.titulo,
        contenido=datos.contenido,
        orden=datos.orden,
    )
    db.add(nueva_leccion)
    db.commit()
    db.refresh(nueva_leccion)
    return nueva_leccion


# ---------------------------------------------------------------------------
# PUT /lecciones/{leccion_id}  -  Solo el profesor dueño o un admin.
# Update parcial: solo se aplican los campos enviados.
# ---------------------------------------------------------------------------
@router.put("/lecciones/{leccion_id}", response_model=LeccionRespuesta)
def actualizar_leccion(
    leccion_id: int,
    datos: LeccionActualizar,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Actualiza titulo, contenido u orden de una leccion."""
    leccion = db.get(Leccion, leccion_id)
    if not leccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada.",
        )

    verificar_propiedad(leccion.curso, usuario)

    if datos.orden is not None:
        validar_orden_disponible(db, leccion.curso_id, datos.orden, leccion.id)
        leccion.orden = datos.orden
    if datos.titulo is not None:
        leccion.titulo = datos.titulo
    if datos.contenido is not None:
        leccion.contenido = datos.contenido

    db.commit()
    db.refresh(leccion)
    return leccion


# ---------------------------------------------------------------------------
# DELETE /lecciones/{leccion_id}  -  Solo el profesor dueño o un admin.
#
# DECISION SOBRE EL BORRADO (criterio de aceptacion de la issue):
# Si la leccion tiene cuestionario, cae en CASCADA con sus preguntas y
# opciones. Esta configurado en app/models/leccion.py:
#     cuestionario = relationship("Cuestionario", cascade="all, delete-orphan", ...)
# Es coherente con la decision tomada en el CRUD de cursos: borrar un
# contenedor borra su arbol de contenido. El frontend debe pedir confirmacion.
# ---------------------------------------------------------------------------
@router.delete("/lecciones/{leccion_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_leccion(
    leccion_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Elimina una leccion (y en cascada su cuestionario si lo tiene)."""
    leccion = db.get(Leccion, leccion_id)
    if not leccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada.",
        )

    verificar_propiedad(leccion.curso, usuario)

    db.delete(leccion)
    db.commit()
    return None
