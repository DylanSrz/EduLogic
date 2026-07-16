"""Motor de evaluacion de EduLogic.

La logica de negocio central del proyecto: recibe las respuestas de un
estudiante, las califica contra la base de datos, registra el intento y
construye la retroalimentacion inmediata.

Vive en la capa de servicios (no en el router) para separar la logica de
negocio del manejo HTTP: el router se encarga de rutas, permisos y
dependencias; este modulo solo sabe calificar.

REGLA DE NEGOCIO (decision de equipo, sprint 5): los intentos son
ilimitados y se guardan TODOS (cada uno con su fecha y puntaje). El
progreso del estudiante (#20) usara el MEJOR puntaje. Racional MVP:
EduLogic premia la practica — repetir un quiz es estudiar, no hacer trampa,
porque el orden de aprendizaje lo pone la explicacion pedagogica.
"""

from sqlalchemy.orm import Session

from app.models.cuestionario import Cuestionario
from app.models.intento import Intento, RespuestaIntento
from app.models.usuario import Usuario
from app.services.excepciones import RecursoNoEncontrado, ReglaDeNegocioViolada
from app.schemas.intento import (
    RespuestaCrear,
    RetroalimentacionPregunta,
    ResultadoIntento,
)


def calificar_intento(
    db: Session,
    usuario: Usuario,
    cuestionario_id: int,
    respuestas: list[RespuestaCrear],
) -> ResultadoIntento:
    """Valida el intento, lo califica, lo guarda y devuelve el resultado completo."""

    # ------------------------------------------------------------------
    # 1. El cuestionario debe existir
    # ------------------------------------------------------------------
    cuestionario = db.get(Cuestionario, cuestionario_id)
    if not cuestionario:
        raise RecursoNoEncontrado("Cuestionario no encontrado.")

    preguntas = cuestionario.preguntas
    if not preguntas:
        raise ReglaDeNegocioViolada("Este cuestionario aún no tiene preguntas.")

    # ------------------------------------------------------------------
    # 2. Validar el intento: una respuesta por CADA pregunta del
    #    cuestionario, sin repetidas ni ajenas. Se valida TODO antes de
    #    calificar nada: un intento malformado no debe dejar rastro.
    # ------------------------------------------------------------------
    elegidas = {r.pregunta_id: r.opcion_id for r in respuestas}

    if len(elegidas) != len(respuestas):
        raise ReglaDeNegocioViolada("Hay preguntas respondidas más de una vez.")

    ids_preguntas = {p.id for p in preguntas}

    faltantes = ids_preguntas - set(elegidas)
    if faltantes:
        raise ReglaDeNegocioViolada(
            f"Faltan respuestas para {len(faltantes)} pregunta(s) del cuestionario."
        )

    ajenas = set(elegidas) - ids_preguntas
    if ajenas:
        raise ReglaDeNegocioViolada(
            "El intento incluye preguntas que no pertenecen a este cuestionario."
        )

    # ------------------------------------------------------------------
    # 3. Calificar pregunta por pregunta y construir la retroalimentacion
    # ------------------------------------------------------------------
    correctas = 0
    retroalimentacion = []

    for pregunta in preguntas:
        opciones_por_id = {o.id: o for o in pregunta.opciones}

        opcion_elegida = opciones_por_id.get(elegidas[pregunta.id])
        if opcion_elegida is None:
            # La opcion enviada existe pero pertenece a OTRA pregunta:
            # sin este chequeo se podria "responder" con una correcta ajena.
            raise ReglaDeNegocioViolada(
                f"La opción enviada no pertenece a la pregunta {pregunta.id}."
            )

        # Los modelos garantizan exactamente UNA correcta por pregunta
        opcion_correcta = next(o for o in pregunta.opciones if o.es_correcta)

        fue_correcta = opcion_elegida.es_correcta
        if fue_correcta:
            correctas += 1

        retroalimentacion.append(
            RetroalimentacionPregunta(
                pregunta_id=pregunta.id,
                enunciado=pregunta.enunciado,
                fue_correcta=fue_correcta,
                opcion_elegida=opcion_elegida.texto,
                opcion_correcta=opcion_correcta.texto,
                explicacion=pregunta.explicacion,
            )
        )

    total = len(preguntas)
    puntaje = round((correctas / total) * 100, 1)

    # ------------------------------------------------------------------
    # 4. Persistir en UNA sola transaccion: el intento y sus respuestas
    #    entran juntos con un unico commit al final. Si algo fallara a
    #    mitad de camino, no quedaria un intento sin respuestas (o al
    #    reves) en la base de datos.
    # ------------------------------------------------------------------
    intento = Intento(
        usuario_id=usuario.id,
        cuestionario_id=cuestionario.id,
        puntaje=puntaje,
        respuestas=[
            RespuestaIntento(
                pregunta_id=pregunta_id,
                opcion_elegida_id=opcion_id,
            )
            for pregunta_id, opcion_id in elegidas.items()
        ],
    )
    db.add(intento)
    db.commit()

    # ------------------------------------------------------------------
    # 5. Devolver el resultado completo para que el frontend pinte la
    #    pantalla de resultados sin pedir nada mas
    # ------------------------------------------------------------------
    return ResultadoIntento(
        puntaje=puntaje,
        total_preguntas=total,
        correctas=correctas,
        retroalimentacion=retroalimentacion,
    )
