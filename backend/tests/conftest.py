"""Configuracion comun de las pruebas.

Las pruebas corren contra un PostgreSQL real, el mismo motor de produccion.
Como limpian las tablas despues de cada prueba, este archivo se niega a
ejecutarse contra una base que no sea local.
"""

import os
from urllib.parse import urlparse

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql://postgres:postgres@localhost:55432/edulogic_test",
)

if urlparse(TEST_DATABASE_URL).hostname not in {"localhost", "127.0.0.1"}:
    raise RuntimeError("Las pruebas solo pueden correr contra una base local.")

# Debe ir ANTES de importar la app: load_dotenv() no pisa variables ya definidas,
# asi el DATABASE_URL real del archivo .env nunca se usa en las pruebas.
os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["SECRET_KEY"] = "clave-solo-para-pruebas-no-usar-en-produccion"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text

from app.database import Base, SessionLocal, engine
from app.main import app
from app.models.cuestionario import Cuestionario
from app.models.curso import Curso
from app.models.leccion import Leccion
from app.models.opcion import Opcion
from app.models.pregunta import Pregunta
from app.models.usuario import RolUsuario, Usuario
from app.services.seguridad import crear_token, hashear_contrasena

CONTRASENA = "clave-de-prueba-123"


@pytest.fixture(autouse=True)
def base_limpia():
    """Deja las tablas vacias al terminar cada prueba."""
    yield
    tablas = ", ".join(t.name for t in Base.metadata.sorted_tables)
    with engine.begin() as conexion:
        conexion.execute(text(f"TRUNCATE {tablas} RESTART IDENTITY CASCADE"))


@pytest.fixture
def db():
    sesion = SessionLocal()
    yield sesion
    sesion.close()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def crear_usuario(db):
    def _crear(email="ana@example.com", rol=RolUsuario.estudiante, activo=True):
        usuario = Usuario(
            nombre="Usuario de prueba",
            email=email,
            contrasena_hash=hashear_contrasena(CONTRASENA),
            rol=rol,
            activo=activo,
        )
        db.add(usuario)
        db.commit()
        return usuario

    return _crear


@pytest.fixture
def estudiante(crear_usuario):
    return crear_usuario()


@pytest.fixture
def profesor(crear_usuario):
    return crear_usuario(email="juan@example.com", rol=RolUsuario.profesor)


@pytest.fixture
def cabecera():
    """Cabecera Authorization con un token valido para el usuario dado."""

    def _cabecera(usuario):
        token = crear_token({"sub": str(usuario.id), "rol": usuario.rol.value})
        return {"Authorization": f"Bearer {token}"}

    return _cabecera


@pytest.fixture
def crear_cuestionario(db, profesor):
    """Crea un cuestionario con N preguntas de dos opciones (correcta e incorrecta)."""

    def _crear(numero_preguntas=2, orden=1):
        curso = Curso(titulo="Logica", descripcion="Curso", creador_id=profesor.id)
        leccion = Leccion(curso=curso, titulo="Tablas de verdad", contenido="...", orden=orden)
        cuestionario = Cuestionario(leccion=leccion, titulo="Quiz")
        for numero in range(1, numero_preguntas + 1):
            Pregunta(
                cuestionario=cuestionario,
                enunciado=f"Pregunta {numero}",
                explicacion=f"Explicacion {numero}",
                opciones=[
                    Opcion(texto=f"Correcta {numero}", es_correcta=True),
                    Opcion(texto=f"Incorrecta {numero}", es_correcta=False),
                ],
            )
        db.add(curso)
        db.commit()
        return cuestionario

    return _crear


def respuestas(cuestionario, correctas):
    """Arma las respuestas de un intento acertando las primeras N preguntas."""
    resultado = []
    for indice, pregunta in enumerate(cuestionario.preguntas):
        acierta = indice < correctas
        opcion = next(o for o in pregunta.opciones if o.es_correcta is acierta)
        resultado.append({"pregunta_id": pregunta.id, "opcion_id": opcion.id})
    return resultado
