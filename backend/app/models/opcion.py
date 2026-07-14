from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Opcion(Base):
    __tablename__ = "opciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pregunta_id = Column(
        Integer, ForeignKey("preguntas.id", ondelete="CASCADE"), nullable=False
    )
    texto = Column(String(500), nullable=False)
    # Regla de negocio: exactamente UNA opción correcta por pregunta (la valida el backend,
    # el esquema relacional no puede expresarla)
    es_correcta = Column(Boolean, nullable=False, server_default="false")

    pregunta = relationship("Pregunta", back_populates="opciones")
