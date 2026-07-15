from pydantic import BaseModel, Field

# De entrada


class CuestionarioCrear(BaseModel):
    """Datos para crear un cuestionario. El leccion_id NO va aqui: llega por la URL del endpoint."""

    titulo: str = Field(min_length=3, max_length=200)


class OpcionCrear(BaseModel):
    """Datos para crear una opcion de respuesta. El pregunta_id NO va aqui: sale de la pregunta a la que pertenece."""

    texto: str = Field(min_length=1, max_length=500)
    es_correcta: bool = False


class PreguntaCrear(BaseModel):
    """Datos para crear una pregunta con sus opciones anidadas. El cuestionario_id llega por la URL.

    La regla de negocio (minimo 2 opciones, exactamente 1 correcta) se valida
    en el router para responder 400 con mensaje claro, no 422 generico.
    """

    enunciado: str = Field(min_length=10)
    explicacion: str = Field(min_length=1)
    opciones: list[OpcionCrear]


# De salida
class OpcionParaEstudiante(BaseModel):
    """Opcion vista por un estudiante. SIN es_correcta: si viajara en el JSON,
    cualquiera veria la respuesta del quiz en las herramientas del navegador."""

    id: int
    texto: str
    model_config = {"from_attributes": True}


class OpcionParaProfesor(BaseModel):
    """Opcion vista por el profesor. Incluye es_correcta: la necesita para editar el quiz."""

    id: int
    texto: str
    es_correcta: bool
    model_config = {"from_attributes": True}


class PreguntaParaEstudiante(BaseModel):
    """Pregunta vista por un estudiante. SIN explicacion: es la retroalimentacion
    que se revela al responder (la entregara el motor de evaluacion), no antes."""

    id: int
    enunciado: str
    opciones: list[OpcionParaEstudiante]
    model_config = {"from_attributes": True}


class PreguntaParaProfesor(BaseModel):
    """Pregunta vista por el profesor. Incluye explicacion y las opciones completas."""

    id: int
    enunciado: str
    explicacion: str
    opciones: list[OpcionParaProfesor]
    model_config = {"from_attributes": True}


class CuestionarioParaEstudiante(BaseModel):
    """Cuestionario completo para presentar el quiz: preguntas y opciones sin respuestas ni explicaciones."""

    id: int
    leccion_id: int
    titulo: str
    preguntas: list[PreguntaParaEstudiante]
    model_config = {"from_attributes": True}


class CuestionarioParaProfesor(BaseModel):
    """Cuestionario completo para edicion: preguntas con explicacion y opciones con es_correcta."""

    id: int
    leccion_id: int
    titulo: str
    preguntas: list[PreguntaParaProfesor]
    model_config = {"from_attributes": True}
