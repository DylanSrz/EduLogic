from datetime import datetime

from pydantic import BaseModel, Field


class RespuestaCrear(BaseModel):
    """Una respuesta individual: que opcion eligio el estudiante en una pregunta."""

    pregunta_id: int
    opcion_id: int


class IntentoCrear(BaseModel):
    """Body del POST de intentos: la lista completa de respuestas del estudiante."""

    respuestas: list[RespuestaCrear] = Field(min_length=1)


class RetroalimentacionPregunta(BaseModel):
    """Resultado de UNA pregunta dentro del intento, con la retroalimentacion pedagogica.

    Aqui SI viajan opcion_correcta y explicacion (a diferencia del GET del
    cuestionario): el estudiante YA respondio, asi que mostrarle la respuesta
    y el porque es justamente la promesa del producto — retroalimentacion
    inmediata. Antes de responder seria trampa; despues es aprendizaje.
    """

    pregunta_id: int
    enunciado: str
    fue_correcta: bool
    opcion_elegida: str
    opcion_correcta: str
    explicacion: str


class ResultadoIntento(BaseModel):
    """Respuesta completa del motor de evaluacion. No viene de un modelo de la
    base de datos: lo construye el servicio a mano (por eso no lleva from_attributes)."""

    puntaje: float
    total_preguntas: int
    correctas: int
    retroalimentacion: list[RetroalimentacionPregunta]


class IntentoResumen(BaseModel):
    """Un intento en el historial del estudiante: cuando lo presento y como le fue."""

    id: int
    puntaje: float
    fecha: datetime

    model_config = {"from_attributes": True}
