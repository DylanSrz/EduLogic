"""Pruebas del motor de evaluacion: la logica central de EduLogic."""

import pytest

from app.models.cuestionario import Cuestionario
from app.models.intento import Intento
from app.schemas.intento import RespuestaCrear
from app.services.evaluacion import calificar_intento
from app.services.excepciones import RecursoNoEncontrado, ReglaDeNegocioViolada
from tests.conftest import respuestas


def calificar(db, usuario, cuestionario, datos):
    return calificar_intento(
        db, usuario, cuestionario.id, [RespuestaCrear(**r) for r in datos]
    )


def test_todas_correctas_da_100(db, estudiante, crear_cuestionario):
    cuestionario = crear_cuestionario(numero_preguntas=2)

    resultado = calificar(db, estudiante, cuestionario, respuestas(cuestionario, 2))

    assert resultado.puntaje == 100
    assert resultado.correctas == 2
    assert resultado.total_preguntas == 2


def test_puntaje_se_redondea_a_un_decimal(db, estudiante, crear_cuestionario):
    cuestionario = crear_cuestionario(numero_preguntas=3)

    resultado = calificar(db, estudiante, cuestionario, respuestas(cuestionario, 2))

    assert resultado.puntaje == 66.7


def test_error_incluye_respuesta_correcta_y_explicacion(db, estudiante, crear_cuestionario):
    cuestionario = crear_cuestionario(numero_preguntas=1)

    resultado = calificar(db, estudiante, cuestionario, respuestas(cuestionario, 0))

    retro = resultado.retroalimentacion[0]
    assert retro.fue_correcta is False
    assert retro.opcion_elegida == "Incorrecta 1"
    assert retro.opcion_correcta == "Correcta 1"
    assert retro.explicacion == "Explicacion 1"


def test_cada_intento_queda_guardado_con_sus_respuestas(db, estudiante, crear_cuestionario):
    cuestionario = crear_cuestionario(numero_preguntas=2)

    calificar(db, estudiante, cuestionario, respuestas(cuestionario, 1))
    calificar(db, estudiante, cuestionario, respuestas(cuestionario, 2))

    intentos = db.query(Intento).order_by(Intento.id).all()
    assert [float(i.puntaje) for i in intentos] == [50, 100]
    assert all(len(i.respuestas) == 2 for i in intentos)


def test_cuestionario_inexistente(db, estudiante):
    with pytest.raises(RecursoNoEncontrado):
        calificar_intento(
            db, estudiante, 999, [RespuestaCrear(pregunta_id=1, opcion_id=1)]
        )


def test_cuestionario_sin_preguntas(db, estudiante, crear_cuestionario):
    cuestionario = crear_cuestionario(numero_preguntas=0)

    with pytest.raises(ReglaDeNegocioViolada, match="no tiene preguntas"):
        calificar(db, estudiante, cuestionario, [{"pregunta_id": 1, "opcion_id": 1}])


def test_intento_incompleto_no_deja_rastro(db, estudiante, crear_cuestionario):
    cuestionario = crear_cuestionario(numero_preguntas=2)
    incompleto = respuestas(cuestionario, 2)[:1]

    with pytest.raises(ReglaDeNegocioViolada, match="Faltan respuestas"):
        calificar(db, estudiante, cuestionario, incompleto)

    assert db.query(Intento).count() == 0


def test_pregunta_repetida(db, estudiante, crear_cuestionario):
    cuestionario = crear_cuestionario(numero_preguntas=1)
    datos = respuestas(cuestionario, 1)

    with pytest.raises(ReglaDeNegocioViolada, match="más de una vez"):
        calificar(db, estudiante, cuestionario, datos + datos)


def test_pregunta_de_otro_cuestionario(db, estudiante, crear_cuestionario):
    cuestionario = crear_cuestionario(numero_preguntas=1)
    otro = crear_cuestionario(numero_preguntas=1)
    datos = respuestas(cuestionario, 1) + respuestas(otro, 1)

    with pytest.raises(ReglaDeNegocioViolada, match="no pertenecen"):
        calificar(db, estudiante, cuestionario, datos)


def test_no_se_puede_responder_con_la_opcion_correcta_de_otra_pregunta(
    db, estudiante, crear_cuestionario
):
    cuestionario = crear_cuestionario(numero_preguntas=2)
    primera, segunda = respuestas(cuestionario, 2)
    trampa = [
        {"pregunta_id": primera["pregunta_id"], "opcion_id": segunda["opcion_id"]},
        segunda,
    ]

    with pytest.raises(ReglaDeNegocioViolada, match="no pertenece a la pregunta"):
        calificar(db, estudiante, cuestionario, trampa)

    assert db.query(Intento).count() == 0
    assert db.get(Cuestionario, cuestionario.id) is not None
