from pydantic import BaseModel, EmailStr, Field
from typing import Literal


class UsuarioCrear(BaseModel):
    nombre: str = Field(min_length=3, max_length=100)
    email: EmailStr
    # max 72: bcrypt ignora todo byte despues del 72 — mejor rechazarlo que truncar en silencio
    contrasena: str = Field(min_length=8, max_length=72)
    rol: Literal["estudiante", "profesor"] = "estudiante"


class UsuarioRespuesta(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: str
    model_config = {"from_attributes": True}


class LoginDatos(BaseModel):
    email: EmailStr
    contrasena: str


class TokenRespuesta(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioRespuesta
