from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Pregunta(Base):
    __tablename__ = "preguntas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cuestionario_id = Column(
        Integer, ForeignKey("cuestionarios.id", ondelete="CASCADE"), nullable=False
    )
    enunciado = Column(Text, nullable=False)
    # Retroalimentación pedagógica que ve el estudiante al fallar — el corazón de EduLogic
    explicacion = Column(Text, nullable=False)

    cuestionario = relationship("Cuestionario", back_populates="preguntas")
    opciones = relationship(
        "Opcion", back_populates="pregunta", cascade="all, delete-orphan"
    )
