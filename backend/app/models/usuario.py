import enum

from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, String, func

from app.database import Base


class RolUsuario(str, enum.Enum):
    """Roles válidos del sistema. Coincide con el enum rol_usuario del modelo de datos."""

    estudiante = "estudiante"
    profesor = "profesor"
    admin = "admin"


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True, index=True)
    contrasena_hash = Column(String(255), nullable=False)  # hash bcrypt, NUNCA texto plano
    rol = Column(
        Enum(RolUsuario, name="rol_usuario"),
        nullable=False,
        server_default=RolUsuario.estudiante.value,
    )
    # Borrado lógico: False = la cuenta no puede iniciar sesión, pero su historial se conserva
    activo = Column(Boolean, nullable=False, server_default="true")
    fecha_registro = Column(DateTime, nullable=False, server_default=func.now())
