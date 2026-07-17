from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cuestionario import Cuestionario
from app.models.intento import Intento
from app.models.usuario import Usuario
from app.schemas.intento import IntentoCrear, IntentoResumen, ResultadoIntento
from app.services.dependencias import requiere_rol
from app.services.evaluacion import calificar_intento

router = APIRouter(tags=["Intentos"])


# ---------------------------------------------------------------------------
# POST /cuestionarios/{cuestionario_id}/intentos  -  Solo estudiantes.
# El router es un "portero" delgado: permisos y HTTP aqui; la calificacion
# vive en app/services/evaluacion.py (la logica de negocio central).
# Un profesor o admin no presenta quizzes: crean y supervisan (403).
# ---------------------------------------------------------------------------
@router.post(
    "/cuestionarios/{cuestionario_id}/intentos",
    response_model=ResultadoIntento,
    status_code=status.HTTP_201_CREATED,
)
def presentar_intento(
    cuestionario_id: int,
    datos: IntentoCrear,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("estudiante")),
):
    """Califica el intento del estudiante y devuelve nota + retroalimentación."""
    return calificar_intento(db, usuario, cuestionario_id, datos.respuestas)


# ---------------------------------------------------------------------------
# GET /cuestionarios/{cuestionario_id}/intentos/mios  -  Solo estudiantes.
# Historial propio: filtra SIEMPRE por el usuario del token, nunca por un
# id que venga del cliente — un estudiante jamas ve intentos ajenos.
# ---------------------------------------------------------------------------
@router.get(
    "/cuestionarios/{cuestionario_id}/intentos/mios",
    response_model=list[IntentoResumen],
)
def mis_intentos(
    cuestionario_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("estudiante")),
):
    """Historial de intentos del estudiante autenticado en este cuestionario."""
    cuestionario = db.get(Cuestionario, cuestionario_id)
    if not cuestionario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cuestionario no encontrado.",
        )

    intentos = (
        db.query(Intento)
        .filter(
            Intento.cuestionario_id == cuestionario_id,
            Intento.usuario_id == usuario.id,
        )
        .order_by(Intento.fecha.desc())
        .all()
    )
    return intentos
