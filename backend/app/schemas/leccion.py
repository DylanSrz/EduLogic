from typing import Optional

from pydantic import BaseModel, Field


class LeccionCrear(BaseModel):
    """Datos para crear una leccion. El curso_id NO va aqui: llega por la URL del endpoint."""

    titulo: str = Field(min_length=3, max_length=200)
    contenido: str = Field(min_length=1)
    orden: int = Field(ge=1)


class LeccionActualizar(BaseModel):
    """Datos para actualizar una leccion. Todos los campos son opcionales (update parcial)."""

    titulo: Optional[str] = Field(default=None, min_length=3, max_length=200)
    contenido: Optional[str] = Field(default=None, min_length=1)
    orden: Optional[int] = Field(default=None, ge=1)


class LeccionRespuesta(BaseModel):
    """Representacion publica de una leccion, con su contenido de estudio completo."""

    id: int
    curso_id: int
    titulo: str
    contenido: str
    orden: int

    model_config = {"from_attributes": True}
