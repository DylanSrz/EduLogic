from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Intento(Base):
    """Cada vez que un estudiante presenta un cuestionario se registra un intento."""

    __tablename__ = "intentos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(
        Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False
    )
    cuestionario_id = Column(
        Integer, ForeignKey("cuestionarios.id", ondelete="CASCADE"), nullable=False
    )
    # Numeric guarda el valor exacto (66.67), sin errores de redondeo de los flotantes
    puntaje = Column(Numeric(5, 2), nullable=False)
    fecha = Column(DateTime, nullable=False, server_default=func.now())

    usuario = relationship("Usuario")
    cuestionario = relationship("Cuestionario")
    respuestas = relationship(
        "RespuestaIntento", back_populates="intento", cascade="all, delete-orphan"
    )


class RespuestaIntento(Base):
    """Qué opción eligió el estudiante en cada pregunta de un intento."""

    __tablename__ = "respuestas_intento"
    __table_args__ = (
        # Una sola respuesta por pregunta en cada intento
        UniqueConstraint("intento_id", "pregunta_id", name="uq_respuesta_intento_pregunta"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    intento_id = Column(
        Integer, ForeignKey("intentos.id", ondelete="CASCADE"), nullable=False
    )
    pregunta_id = Column(
        Integer, ForeignKey("preguntas.id", ondelete="CASCADE"), nullable=False
    )
    opcion_elegida_id = Column(
        Integer, ForeignKey("opciones.id", ondelete="CASCADE"), nullable=False
    )

    intento = relationship("Intento", back_populates="respuestas")
    pregunta = relationship("Pregunta")
    opcion_elegida = relationship("Opcion")
