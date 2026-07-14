import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class NivelCurso(str, enum.Enum):
    """Niveles de dificultad. Coincide con el enum nivel_curso del modelo de datos."""

    basico = "basico"
    intermedio = "intermedio"
    avanzado = "avanzado"


class Curso(Base):
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text)
    nivel = Column(
        Enum(NivelCurso, name="nivel_curso"),
        nullable=False,
        server_default=NivelCurso.basico.value,
    )
    # Sin cascada a propósito: no se puede eliminar un usuario que tenga cursos creados
    creador_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    fecha_creacion = Column(DateTime, nullable=False, server_default=func.now())

    creador = relationship("Usuario")
    # Si se elimina el curso, sus lecciones caen con él (cascada definida en el modelo de datos)
    lecciones = relationship(
        "Leccion",
        back_populates="curso",
        cascade="all, delete-orphan",
        order_by="Leccion.orden",
    )
