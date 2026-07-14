from sqlalchemy import Column, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class Leccion(Base):
    __tablename__ = "lecciones"
    __table_args__ = (
        # No puede haber dos lecciones con el mismo orden dentro del mismo curso
        UniqueConstraint("curso_id", "orden", name="uq_leccion_curso_orden"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    curso_id = Column(
        Integer, ForeignKey("cursos.id", ondelete="CASCADE"), nullable=False
    )
    titulo = Column(String(200), nullable=False)
    contenido = Column(Text, nullable=False)  # el material de estudio de la lección
    orden = Column(Integer, nullable=False)  # posición dentro del curso (1, 2, 3...)

    curso = relationship("Curso", back_populates="lecciones")
    # Un cuestionario por lección (relación 1 a 1) — uselist=False devuelve el objeto, no una lista
    cuestionario = relationship(
        "Cuestionario",
        back_populates="leccion",
        cascade="all, delete-orphan",
        uselist=False,
    )
