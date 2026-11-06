"""Pruebas HTTP de los quizzes y de la regla para completar lecciones."""

from tests.conftest import respuestas


def presentar(client, cuestionario, datos, headers):
    return client.post(
        f"/cuestionarios/{cuestionario.id}/intentos",
        json={"respuestas": datos},
        headers=headers,
    )


def test_estudiante_no_ve_las_respuestas_antes_de_contestar(
    client, estudiante, crear_cuestionario, cabecera
):
    cuestionario = crear_cuestionario()

    respuesta = client.get(
        f"/cuestionarios/{cuestionario.id}", headers=cabecera(estudiante)
    )

    assert respuesta.status_code == 200
    assert "es_correcta" not in respuesta.text
    assert "Explicacion" not in respuesta.text


def test_estudiante_presenta_un_intento(client, estudiante, crear_cuestionario, cabecera):
    cuestionario = crear_cuestionario()

    respuesta = presentar(
        client, cuestionario, respuestas(cuestionario, 1), cabecera(estudiante)
    )

    assert respuesta.status_code == 201
    assert respuesta.json()["puntaje"] == 50
    assert len(respuesta.json()["retroalimentacion"]) == 2


def test_profesor_no_presenta_quizzes(client, profesor, crear_cuestionario, cabecera):
    cuestionario = crear_cuestionario()

    respuesta = presentar(
        client, cuestionario, respuestas(cuestionario, 2), cabecera(profesor)
    )

    assert respuesta.status_code == 403


def test_presentar_sin_sesion_no_esta_permitido(client, crear_cuestionario):
    cuestionario = crear_cuestionario()

    respuesta = presentar(client, cuestionario, respuestas(cuestionario, 2), {})

    assert respuesta.status_code == 401


def test_regla_violada_responde_400_con_formato_unico(
    client, estudiante, crear_cuestionario, cabecera
):
    cuestionario = crear_cuestionario()

    respuesta = presentar(
        client, cuestionario, respuestas(cuestionario, 2)[:1], cabecera(estudiante)
    )

    assert respuesta.status_code == 400
    assert "Faltan respuestas" in respuesta.json()["detail"]


def test_historial_solo_muestra_mis_intentos(
    client, estudiante, crear_usuario, crear_cuestionario, cabecera
):
    otro = crear_usuario(email="luis@example.com")
    cuestionario = crear_cuestionario()
    presentar(client, cuestionario, respuestas(cuestionario, 2), cabecera(otro))
    presentar(client, cuestionario, respuestas(cuestionario, 1), cabecera(estudiante))

    respuesta = client.get(
        f"/cuestionarios/{cuestionario.id}/intentos/mios", headers=cabecera(estudiante)
    )

    assert [i["puntaje"] for i in respuesta.json()] == [50]


def test_leccion_con_quiz_exige_el_100(client, estudiante, crear_cuestionario, cabecera):
    cuestionario = crear_cuestionario()
    leccion_id = cuestionario.leccion_id
    headers = cabecera(estudiante)
    presentar(client, cuestionario, respuestas(cuestionario, 1), headers)

    antes = client.post(f"/lecciones/{leccion_id}/completar", headers=headers)
    assert antes.status_code == 400

    presentar(client, cuestionario, respuestas(cuestionario, 2), headers)
    despues = client.post(f"/lecciones/{leccion_id}/completar", headers=headers)
    assert despues.status_code == 200
    assert despues.json()["porcentaje"] == 100


def test_completar_dos_veces_no_duplica(client, estudiante, crear_cuestionario, cabecera):
    cuestionario = crear_cuestionario()
    headers = cabecera(estudiante)
    presentar(client, cuestionario, respuestas(cuestionario, 2), headers)

    client.post(f"/lecciones/{cuestionario.leccion_id}/completar", headers=headers)
    repetido = client.post(f"/lecciones/{cuestionario.leccion_id}/completar", headers=headers)

    assert repetido.status_code == 200
    assert repetido.json()["lecciones_completadas"] == 1
