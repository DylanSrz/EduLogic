from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.progreso import LeccionCompletada, ProgresoCurso, ResumenCurso
from app.services.dependencias import requiere_rol, usuario_actual
from app.services.progreso import marcar_completada, progreso_de_curso, resumen_global

# Sin prefix: las rutas viven en 2 familias (/lecciones/... y /progreso/...)
router = APIRouter(tags=["Progreso"])


# ---------------------------------------------------------------------------
# POST /lecciones/{leccion_id}/completar  -  Solo estudiantes.
# Responde 200 (no 201) a proposito: es IDEMPOTENTE — marcar dos veces
# devuelve el mismo resultado sin duplicar registros.
# ---------------------------------------------------------------------------
@router.post("/lecciones/{leccion_id}/completar", response_model=LeccionCompletada)
def completar_leccion(
    leccion_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("estudiante")),
):
    """Marca la leccion como completada y devuelve el avance actualizado del curso."""
    return marcar_completada(db, usuario, leccion_id)


# ---------------------------------------------------------------------------
# GET /progreso/cursos/{curso_id}  -  Cualquier usuario autenticado.
# Siempre devuelve el progreso DEL USUARIO DEL TOKEN: no existe forma de
# pedir el progreso de otra persona (no hay parametro de usuario a proposito).
# ---------------------------------------------------------------------------
@router.get("/progreso/cursos/{curso_id}", response_model=ProgresoCurso)
def progreso_en_curso(
    curso_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(usuario_actual),
):
    """Avance del usuario autenticado en un curso: lecciones, porcentaje y mejores puntajes."""
    return progreso_de_curso(db, usuario, curso_id)


# ---------------------------------------------------------------------------
# GET /progreso/resumen  -  Cualquier usuario autenticado.
# ---------------------------------------------------------------------------
@router.get("/progreso/resumen", response_model=list[ResumenCurso])
def mi_progreso(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(usuario_actual),
):
    """Vista global 'Mi progreso': cursos con actividad y su porcentaje de avance."""
    return resumen_global(db, usuario)
