from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Cuestionario(Base):
    __tablename__ = "cuestionarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    # unique=True materializa la decisión del equipo: UN cuestionario por lección (1 a 1)
    leccion_id = Column(
        Integer,
        ForeignKey("lecciones.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    titulo = Column(String(200), nullable=False)

    leccion = relationship("Leccion", back_populates="cuestionario")
    preguntas = relationship(
        "Pregunta", back_populates="cuestionario", cascade="all, delete-orphan"
    )
