from pydantic import BaseModel, EmailStr, Field
from typing import Literal

class UsuarioCrear(BaseModel):
    nombre: str = Field(min_length=3, max_length=100)
    email: EmailStr
    contrasena: str = Field(min_length=8)
    rol: Literal["estudiante", "profesor"] = "estudiante"


class UsuarioRespuesta(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: str
    model_config = {"from_attributes": True}