from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import datetime


class UsuarioCrear(BaseModel):
    nombre: str = Field(min_length=3, max_length=100)
    email: EmailStr
    # max 72: bcrypt ignora todo byte despues del 72 — mejor rechazarlo que truncar en silencio
    contrasena: str = Field(min_length=8, max_length=72)
    rol: Literal["estudiante", "profesor", "admin"] = "estudiante"


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


class UsuarioDetalleAdmin(BaseModel):
    """Respuesta detallada de un usuario para el panel de administración.
    Incluye el campo 'activo' y 'fecha_registro' que no se exponen en la
    respuesta pública (UsuarioRespuesta). La contraseña NUNCA se incluye."""
    id: int
    nombre: str
    email: EmailStr
    rol: str
    activo: bool                          # ← Campo agregado para que el admin vea si la cuenta está activa/desactivada
    fecha_registro: Optional[datetime]    # ← Campo agregado para información administrativa
    model_config = {"from_attributes": True}


class CambioRol(BaseModel):
    """Schema para la actualización del rol de un usuario por el admin.
    Solo permite los 3 roles válidos del sistema."""
    rol: Literal["estudiante", "profesor", "admin"]  # ← Se incluyen los 3 roles válidos (antes solo estudiante/profesor)


class PaginaUsuarios(BaseModel):
    """Respuesta paginada para el listado de usuarios.
    Incluye metadatos de paginación para que el frontend sepa cuántas
    páginas hay y pueda navegar entre ellas."""
    usuarios: list[UsuarioDetalleAdmin]   # ← Lista de usuarios de la página actual
    total: int                            # ← Total de usuarios que coinciden con el filtro
    pagina: int                           # ← Página actual solicitada
    tamanio: int                          # ← Cantidad de usuarios por página
    total_paginas: int                    # ← Total de páginas disponibles
