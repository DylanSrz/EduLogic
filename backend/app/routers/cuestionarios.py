from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cuestionario import Cuestionario
from app.models.leccion import Leccion
from app.models.opcion import Opcion
from app.models.pregunta import Pregunta
from app.models.usuario import Usuario
from app.schemas.cuestionario import (
    CuestionarioCrear,
    CuestionarioParaEstudiante,
    CuestionarioParaProfesor,
    PreguntaCrear,
    PreguntaParaProfesor,
)
from app.services.dependencias import requiere_rol, usuario_actual

# Sin prefix: las rutas viven en 3 familias (/lecciones, /cuestionarios, /preguntas)
router = APIRouter(tags=["Cuestionarios"])


def verificar_propiedad(curso, usuario):
    """Admin puede todo; un profesor solo modifica el contenido de sus propios cursos."""
    if usuario.rol.value != "admin" and curso.creador_id != usuario.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para modificar el contenido de este curso.",
        )


def validar_opciones(opciones):
    """Regla de negocio del motor de evaluacion: sin exactamente una opcion
    correcta, una pregunta seria incalificable."""
    if len(opciones) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Una pregunta necesita al menos 2 opciones.",
        )
    cantidad_correctas = sum(1 for opcion in opciones if opcion.es_correcta)
    if cantidad_correctas != 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe haber exactamente una opción correcta.",
        )


# ---------------------------------------------------------------------------
# POST /lecciones/{leccion_id}/cuestionarios  -  Solo profesor dueño o admin.
# Una leccion tiene MAXIMO un cuestionario (unique en la BD) -> 409 si ya existe.
# ---------------------------------------------------------------------------
@router.post(
    "/lecciones/{leccion_id}/cuestionarios",
    response_model=CuestionarioParaProfesor,
    status_code=status.HTTP_201_CREATED,
)
def crear_cuestionario(
    leccion_id: int,
    datos: CuestionarioCrear,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Crea el cuestionario de una leccion. El leccion_id sale de la URL."""
    leccion = db.get(Leccion, leccion_id)
    if not leccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada.",
        )

    verificar_propiedad(leccion.curso, usuario)

    if leccion.cuestionario:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Esta lección ya tiene un cuestionario.",
        )

    nuevo_cuestionario = Cuestionario(leccion_id=leccion.id, titulo=datos.titulo)
    db.add(nuevo_cuestionario)
    db.commit()
    db.refresh(nuevo_cuestionario)
    return nuevo_cuestionario


# ---------------------------------------------------------------------------
# GET /cuestionarios/{cuestionario_id}  -  Cualquier usuario autenticado.
#
# DECISION DE SEGURIDAD: el esquema de respuesta depende de QUIEN pregunta.
# - Profesor dueño del curso o admin -> CuestionarioParaProfesor (con
#   es_correcta y explicacion, los necesita para editar).
# - Estudiante, o profesor que NO es dueño -> CuestionarioParaEstudiante
#   (sin es_correcta ni explicacion). Un profesor ajeno no tiene por que ver
#   las respuestas de los quizzes de otro: principio de minimo privilegio.
# Sin response_model en el decorador porque el esquema se decide en el codigo.
# ---------------------------------------------------------------------------
@router.get("/cuestionarios/{cuestionario_id}")
def obtener_cuestionario(
    cuestionario_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(usuario_actual),
):
    """Devuelve el cuestionario con preguntas y opciones, filtrado segun el rol."""
    cuestionario = db.get(Cuestionario, cuestionario_id)
    if not cuestionario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cuestionario no encontrado.",
        )

    return respuesta_segun_rol(cuestionario, usuario)


def respuesta_segun_rol(cuestionario, usuario):
    """Aplica la decision de seguridad del GET: version completa solo para
    el profesor dueño del curso o un admin; filtrada para el resto."""
    es_editor = usuario.rol.value == "admin" or (
        usuario.rol.value == "profesor"
        and cuestionario.leccion.curso.creador_id == usuario.id
    )
    if es_editor:
        return CuestionarioParaProfesor.model_validate(cuestionario)
    return CuestionarioParaEstudiante.model_validate(cuestionario)


# ---------------------------------------------------------------------------
# GET /lecciones/{leccion_id}/cuestionario  -  Cualquier usuario autenticado.
# El frontend navega desde la leccion hacia su quiz (panel del profesor y
# vista del estudiante): este endpoint evita que el cliente tenga que
# adivinar el id del cuestionario. Mismo filtrado por rol del GET anterior.
# ---------------------------------------------------------------------------
@router.get("/lecciones/{leccion_id}/cuestionario")
def obtener_cuestionario_de_leccion(
    leccion_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(usuario_actual),
):
    """Devuelve el cuestionario de una leccion, filtrado segun el rol."""
    leccion = db.get(Leccion, leccion_id)
    if not leccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada.",
        )

    if not leccion.cuestionario:
        # 404 con mensaje propio: el frontend usa este caso para ofrecer
        # "crear cuestionario" en el panel del profesor.
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Esta lección no tiene cuestionario.",
        )

    return respuesta_segun_rol(leccion.cuestionario, usuario)


# ---------------------------------------------------------------------------
# POST /cuestionarios/{cuestionario_id}/preguntas  -  Solo profesor dueño o admin.
# La pregunta se crea CON sus opciones en una sola operacion: el relationship
# de SQLAlchemy inserta padre e hijos con los ids correctos en un solo commit.
# ---------------------------------------------------------------------------
@router.post(
    "/cuestionarios/{cuestionario_id}/preguntas",
    response_model=PreguntaParaProfesor,
    status_code=status.HTTP_201_CREATED,
)
def crear_pregunta(
    cuestionario_id: int,
    datos: PreguntaCrear,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Agrega una pregunta con sus opciones. Minimo 2 opciones, exactamente 1 correcta."""
    cuestionario = db.get(Cuestionario, cuestionario_id)
    if not cuestionario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cuestionario no encontrado.",
        )

    verificar_propiedad(cuestionario.leccion.curso, usuario)
    validar_opciones(datos.opciones)

    nueva_pregunta = Pregunta(
        cuestionario_id=cuestionario.id,
        enunciado=datos.enunciado,
        explicacion=datos.explicacion,
        opciones=[
            Opcion(texto=opcion.texto, es_correcta=opcion.es_correcta)
            for opcion in datos.opciones
        ],
    )
    db.add(nueva_pregunta)
    db.commit()
    db.refresh(nueva_pregunta)
    return nueva_pregunta


# ---------------------------------------------------------------------------
# PUT /preguntas/{pregunta_id}  -  Solo profesor dueño o admin.
# Edicion completa: al reasignar pregunta.opciones, el cascade
# "all, delete-orphan" del modelo borra las opciones viejas e inserta las nuevas.
# ---------------------------------------------------------------------------
@router.put("/preguntas/{pregunta_id}", response_model=PreguntaParaProfesor)
def actualizar_pregunta(
    pregunta_id: int,
    datos: PreguntaCrear,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Reemplaza el enunciado, la explicacion y las opciones de una pregunta."""
    pregunta = db.get(Pregunta, pregunta_id)
    if not pregunta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pregunta no encontrada.",
        )

    verificar_propiedad(pregunta.cuestionario.leccion.curso, usuario)
    validar_opciones(datos.opciones)

    pregunta.enunciado = datos.enunciado
    pregunta.explicacion = datos.explicacion
    pregunta.opciones = [
        Opcion(texto=opcion.texto, es_correcta=opcion.es_correcta)
        for opcion in datos.opciones
    ]

    db.commit()
    db.refresh(pregunta)
    return pregunta


# ---------------------------------------------------------------------------
# DELETE /preguntas/{pregunta_id}  -  Solo profesor dueño o admin.
# ---------------------------------------------------------------------------
@router.delete("/preguntas/{pregunta_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pregunta(
    pregunta_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Elimina una pregunta (y en cascada sus opciones)."""
    pregunta = db.get(Pregunta, pregunta_id)
    if not pregunta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pregunta no encontrada.",
        )

    verificar_propiedad(pregunta.cuestionario.leccion.curso, usuario)

    db.delete(pregunta)
    db.commit()
    return None


# ---------------------------------------------------------------------------
# DELETE /cuestionarios/{cuestionario_id}  -  Solo profesor dueño o admin.
# La cascada de los modelos arrastra preguntas y opciones.
# ---------------------------------------------------------------------------
@router.delete(
    "/cuestionarios/{cuestionario_id}", status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_cuestionario(
    cuestionario_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(requiere_rol("profesor", "admin")),
):
    """Elimina el cuestionario completo con sus preguntas y opciones."""
    cuestionario = db.get(Cuestionario, cuestionario_id)
    if not cuestionario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cuestionario no encontrado.",
        )

    verificar_propiedad(cuestionario.leccion.curso, usuario)

    db.delete(cuestionario)
    db.commit()
    return None
