from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class CursoCrear(BaseModel):
    """Datos para crear un curso. El creador_id NO va aqui: sale del usuario autenticado."""

    titulo: str = Field(min_length=3, max_length=200)
    descripcion: Optional[str] = None
    nivel: Literal["basico", "intermedio", "avanzado"] = "basico"


class CursoActualizar(BaseModel):
    """Datos para actualizar un curso. Todos los campos son opcionales (PATCH parcial)."""

    titulo: Optional[str] = Field(default=None, min_length=3, max_length=200)
    descripcion: Optional[str] = None
    nivel: Optional[Literal["basico", "intermedio", "avanzado"]] = None


class CursoRespuesta(BaseModel):
    """Representacion publica de un curso. Incluye id y creador_id (nunca la contrasena)."""

    id: int
    titulo: str
    descripcion: Optional[str]
    nivel: str
    creador_id: int
    fecha_creacion: datetime

    model_config = {"from_attributes": True}


class CursoAdminRespuesta(BaseModel):
    """Representacion de un curso para el panel de administracion.
    Incluye el nombre del creador ademas de los campos publicos."""

    id: int
    titulo: str
    descripcion: Optional[str]
    nivel: str
    creador_id: int
    creador_nombre: str
    fecha_creacion: datetime