from typing import Optional

from pydantic import BaseModel


class LeccionCompletada(BaseModel):
    """Respuesta al marcar una leccion: confirma y devuelve el avance actualizado
    del curso para que el frontend actualice la barra sin otra peticion."""

    leccion_id: int
    curso_id: int
    completada: bool
    lecciones_completadas: int
    total_lecciones: int
    porcentaje: float


class LeccionConEstado(BaseModel):
    """Una leccion del curso con el estado de avance del estudiante."""

    leccion_id: int
    titulo: str
    orden: int
    completada: bool


class MejorPuntaje(BaseModel):
    """El mejor puntaje del estudiante en un cuestionario del curso.

    mejor_puntaje es None si el estudiante nunca lo ha intentado — la regla
    de equipo del motor de evaluacion: intentos ilimitados, el progreso usa
    el MEJOR de todos.
    """

    cuestionario_id: int
    titulo: str
    leccion_id: int
    mejor_puntaje: Optional[float]


class ProgresoCurso(BaseModel):
    """Resumen completo del avance del estudiante en UN curso: alimenta la
    vista de detalle de 'Mi progreso'."""

    curso_id: int
    titulo: str
    total_lecciones: int
    lecciones_completadas: int
    porcentaje: float
    lecciones: list[LeccionConEstado]
    cuestionarios: list[MejorPuntaje]


class ResumenCurso(BaseModel):
    """Un curso con actividad del estudiante, para la vista global 'Mi progreso'."""

    curso_id: int
    titulo: str
    nivel: str
    total_lecciones: int
    lecciones_completadas: int
    porcentaje: float
