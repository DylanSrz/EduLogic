from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.curso import Curso, NivelCurso
from app.models.usuario import Usuario
from app.schemas.curso import CursoActualizar, CursoCrear, CursoRespuesta
from app.services.dependencias import requiere_rol, usuario_actual

router = APIRouter(prefix="/cursos", tags=["Cursos"])


# ---------------------------------------------------------------------------
# GET /cursos  -  Publico (catalogo visible sin cuenta, invita a registrarse)
# ---------------------------------------------------------------------------
@router.get("", response_model=list[CursoRespuesta])
def listar_cursos(db: Session = Depends(get_db)):
    """Lista todos los cursos. No requiere token."""
    cursos = db.query(Curso).order_by(Curso.fecha_creacion.desc()).all()
    return cursos


# ---------------------------------------------------------------------------
# GET /cursos/{curso_id}  -  Publico. 404 si no existe.
# ---------------------------------------------------------------------------
@router.get("/{curso_id}", response_model=CursoRespuesta)
def obtener_curso(curso_id: int, db: Session = Depends(get_db)):
    """Detalle de un curso por id. Si el id no existe -> 404."""
    curso = db.get(Curso, curso_id)
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curso no encontrado.",
        )
    return curso


# ---------------------------------------------------------------------------
# POST /cursos  -  Solo profesor o admin. creador_id sale del token, NO del body.
# ---------------------------------------------------------------------------
@router.post(
    "",
    response_model=CursoRespuesta,
    status_code=status.HTTP_201_CREATED,
)
def crear_curso(
    datos: CursoCrear,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Crea un curso. El creador_id se toma del usuario autenticado."""
    nuevo_curso = Curso(
        titulo=datos.titulo,
        descripcion=datos.descripcion,
        nivel=NivelCurso(datos.nivel),
        creador_id=usuario.id,
    )
    db.add(nuevo_curso)
    db.commit()
    db.refresh(nuevo_curso)
    return nuevo_curso


# ---------------------------------------------------------------------------
# PUT /cursos/{curso_id}  -  Solo el creador (profesor) o un admin.
# Un profesor no edita cursos ajenos (403).
# ---------------------------------------------------------------------------
@router.put("/{curso_id}", response_model=CursoRespuesta)
def actualizar_curso(
    curso_id: int,
    datos: CursoActualizar,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Actualiza un curso. Solo el profesor creador o un admin."""
    curso = db.get(Curso, curso_id)
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curso no encontrado.",
        )

    # Verificacion de propiedad: admin puede todo; profesor solo los suyos
    if usuario.rol.value != "admin" and curso.creador_id != usuario.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para editar este curso.",
        )

    # Aplicar solo los campos proporcionados (update parcial)
    if datos.titulo is not None:
        curso.titulo = datos.titulo
    if datos.descripcion is not None:
        curso.descripcion = datos.descripcion
    if datos.nivel is not None:
        curso.nivel = NivelCurso(datos.nivel)

    db.commit()
    db.refresh(curso)
    return curso


# ---------------------------------------------------------------------------
# DELETE /cursos/{curso_id}  -  Solo el creador (profesor) o un admin.
#
# DECISION DE EQUIPO SOBRE EL BORRADO (criterio de aceptacion de la issue):
# Si el curso tiene lecciones asociadas, estas se eliminan en CASCADA.
# Esto esta configurado en app/models/curso.py:
#     lecciones = relationship("Leccion", cascade="all, delete-orphan", ...)
# Y respaldado en la FK de app/models/leccion.py:
#     curso_id = Column(Integer, ForeignKey("cursos.id", ondelete="CASCADE"))
# Tambien caen en cascada los cuestionarios, preguntas, opciones e intentos
# vinculados a esas lecciones. Es la decision acordada: borrar un curso
# borra todo su arbol de contenido. El frontend debe pedir confirmacion.
# ---------------------------------------------------------------------------
@router.delete("/{curso_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_curso(
    curso_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Elimina un curso (y en cascada sus lecciones y cuestionarios)."""
    curso = db.get(Curso, curso_id)
    if not curso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curso no encontrado.",
        )

    if usuario.rol.value != "admin" and curso.creador_id != usuario.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para eliminar este curso.",
        )

    db.delete(curso)
    db.commit()
    return None