"""Pruebas de registro, inicio de sesion y validacion de tokens."""

from datetime import datetime, timedelta, timezone

import jwt
import pytest

from app.models.usuario import RolUsuario, Usuario
from app.services.seguridad import (
    ALGORITMO,
    SECRET_KEY,
    hashear_contrasena,
    verificar_contrasena,
)
from tests.conftest import CONTRASENA

DATOS_REGISTRO = {
    "nombre": "Ana Perez",
    "email": "ana@example.com",
    "contrasena": CONTRASENA,
}


def test_contrasena_se_guarda_hasheada():
    hash_guardado = hashear_contrasena(CONTRASENA)

    assert hash_guardado != CONTRASENA
    assert verificar_contrasena(CONTRASENA, hash_guardado)
    assert not verificar_contrasena("otra-clave", hash_guardado)


def test_registro_crea_estudiante_por_defecto(client, db):
    respuesta = client.post("/auth/registro", json=DATOS_REGISTRO)

    assert respuesta.status_code == 201
    assert respuesta.json()["rol"] == "estudiante"
    assert "contrasena" not in respuesta.text
    assert "contrasena_hash" not in respuesta.text
    assert db.query(Usuario).one().activo is True


def test_nadie_puede_registrarse_como_admin(client, db):
    respuesta = client.post("/auth/registro", json={**DATOS_REGISTRO, "rol": "admin"})

    assert respuesta.status_code == 422
    assert db.query(Usuario).count() == 0


def test_email_duplicado(client, estudiante):
    respuesta = client.post("/auth/registro", json=DATOS_REGISTRO)

    assert respuesta.status_code == 409


def test_contrasena_corta_se_rechaza(client):
    respuesta = client.post("/auth/registro", json={**DATOS_REGISTRO, "contrasena": "corta"})

    assert respuesta.status_code == 422
    assert "contrasena" in respuesta.json()["detail"]


def test_login_devuelve_un_token_que_funciona(client, estudiante):
    respuesta = client.post(
        "/auth/login", json={"email": estudiante.email, "contrasena": CONTRASENA}
    )
    assert respuesta.status_code == 200
    token = respuesta.json()["access_token"]

    yo = client.get("/auth/yo", headers={"Authorization": f"Bearer {token}"})

    assert yo.status_code == 200
    assert yo.json()["email"] == estudiante.email


@pytest.mark.parametrize(
    "email, contrasena",
    [("ana@example.com", "clave-equivocada"), ("nadie@example.com", CONTRASENA)],
)
def test_credenciales_incorrectas(client, estudiante, email, contrasena):
    respuesta = client.post("/auth/login", json={"email": email, "contrasena": contrasena})

    assert respuesta.status_code == 401
    assert respuesta.json()["detail"] == "Credenciales incorrectas."


def test_cuenta_desactivada_no_inicia_sesion(client, crear_usuario):
    usuario = crear_usuario(activo=False)

    respuesta = client.post(
        "/auth/login", json={"email": usuario.email, "contrasena": CONTRASENA}
    )

    assert respuesta.status_code == 401


def test_token_de_cuenta_desactivada_deja_de_servir(client, db, estudiante, cabecera):
    headers = cabecera(estudiante)
    estudiante.activo = False
    db.commit()

    assert client.get("/auth/yo", headers=headers).status_code == 401


def test_token_expirado(client, estudiante):
    token = jwt.encode(
        {
            "sub": str(estudiante.id),
            "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
        },
        SECRET_KEY,
        algorithm=ALGORITMO,
    )

    respuesta = client.get("/auth/yo", headers={"Authorization": f"Bearer {token}"})

    assert respuesta.status_code == 401
    assert respuesta.json()["detail"] == "El token ha expirado."


def test_token_firmado_con_otra_clave(client, estudiante):
    token = jwt.encode(
        {"sub": str(estudiante.id), "rol": RolUsuario.admin.value},
        "otra-clave-que-no-es-la-del-servidor-de-edulogic",
        algorithm=ALGORITMO,
    )

    respuesta = client.get("/auth/yo", headers={"Authorization": f"Bearer {token}"})

    assert respuesta.status_code == 401
