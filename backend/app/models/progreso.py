from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Progreso(Base):
    """Registra qué lecciones ha completado cada usuario."""

    __tablename__ = "progreso"
    __table_args__ = (
        # Un registro por usuario y lección: marcar dos veces no duplica (idempotente)
        UniqueConstraint("usuario_id", "leccion_id", name="uq_progreso_usuario_leccion"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(
        Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False
    )
    leccion_id = Column(
        Integer, ForeignKey("lecciones.id", ondelete="CASCADE"), nullable=False
    )
    completada = Column(Boolean, nullable=False, server_default="true")
    fecha = Column(DateTime, nullable=False, server_default=func.now())

    usuario = relationship("Usuario")
    leccion = relationship("Leccion")
