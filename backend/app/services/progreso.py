"""Servicio de progreso del estudiante.

Responde dos preguntas: ¿que lecciones he completado? y ¿como me ha ido en
los cuestionarios? Toda consulta filtra SIEMPRE por el usuario autenticado
(el que viene del token): un estudiante jamas puede ver el progreso de otro.

Las consultas SQL equivalentes estan en database/consultas/progreso.sql
(evidencia de consultas funcionales que exige el enunciado).
"""

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.curso import Curso
from app.models.intento import Intento
from app.models.leccion import Leccion
from app.models.progreso import Progreso
from app.models.usuario import Usuario
from app.services.excepciones import RecursoNoEncontrado, ReglaDeNegocioViolada
from app.schemas.progreso import (
    LeccionCompletada,
    LeccionConEstado,
    MejorPuntaje,
    ProgresoCurso,
    ResumenCurso,
)


def _conteo_curso(db: Session, usuario: Usuario, curso_id: int):
    """Devuelve (total_lecciones, completadas, porcentaje) de un curso para el usuario."""
    total = (
        db.query(func.count(Leccion.id))
        .filter(Leccion.curso_id == curso_id)
        .scalar()
    )
    completadas = (
        db.query(func.count(Progreso.id))
        .join(Leccion, Progreso.leccion_id == Leccion.id)
        .filter(
            Leccion.curso_id == curso_id,
            Progreso.usuario_id == usuario.id,
            Progreso.completada.is_(True),
        )
        .scalar()
    )
    porcentaje = round((completadas / total) * 100, 1) if total else 0.0
    return total, completadas, porcentaje


def marcar_completada(db: Session, usuario: Usuario, leccion_id: int) -> LeccionCompletada:
    """Marca una leccion como completada. Idempotente: marcarla dos veces no
    duplica registros ni cambia el resultado (ademas del chequeo, el
    UniqueConstraint uq_progreso_usuario_leccion lo garantiza en la BD).

    Regla de negocio (decision de equipo, 2026-07-18): si la leccion tiene
    cuestionario, solo puede completarse tras aprobarlo con el 100% (cuenta
    el mejor puntaje entre todos los intentos). Una leccion sin cuestionario
    se completa libremente."""
    leccion = db.get(Leccion, leccion_id)
    if not leccion:
        raise RecursoNoEncontrado("Lección no encontrada.")

    if leccion.cuestionario:
        mejor = (
            db.query(func.max(Intento.puntaje))
            .filter(
                Intento.usuario_id == usuario.id,
                Intento.cuestionario_id == leccion.cuestionario.id,
            )
            .scalar()
        )
        if mejor is None or float(mejor) < 100:
            raise ReglaDeNegocioViolada(
                "Para completar esta lección debes aprobar su cuestionario con el 100%."
            )

    existente = (
        db.query(Progreso)
        .filter(
            Progreso.usuario_id == usuario.id,
            Progreso.leccion_id == leccion_id,
        )
        .first()
    )
    if not existente:
        db.add(Progreso(usuario_id=usuario.id, leccion_id=leccion_id))
        db.commit()

    total, completadas, porcentaje = _conteo_curso(db, usuario, leccion.curso_id)
    return LeccionCompletada(
        leccion_id=leccion_id,
        curso_id=leccion.curso_id,
        completada=True,
        lecciones_completadas=completadas,
        total_lecciones=total,
        porcentaje=porcentaje,
    )


def progreso_de_curso(db: Session, usuario: Usuario, curso_id: int) -> ProgresoCurso:
    """Avance del usuario en un curso: lecciones con estado, porcentaje y el
    mejor puntaje de cada cuestionario del curso."""
    curso = db.get(Curso, curso_id)
    if not curso:
        raise RecursoNoEncontrado("Curso no encontrado.")

    lecciones = (
        db.query(Leccion)
        .filter(Leccion.curso_id == curso_id)
        .order_by(Leccion.orden)
        .all()
    )

    # ids de las lecciones de ESTE curso que el usuario ya completo
    completadas_ids = {
        leccion_id
        for (leccion_id,) in db.query(Progreso.leccion_id)
        .join(Leccion, Progreso.leccion_id == Leccion.id)
        .filter(
            Leccion.curso_id == curso_id,
            Progreso.usuario_id == usuario.id,
            Progreso.completada.is_(True),
        )
        .all()
    }

    # mejor puntaje por cuestionario del usuario (func.max = la regla del
    # motor de evaluacion: se guardan todos los intentos, cuenta el mejor)
    mejores = dict(
        db.query(Intento.cuestionario_id, func.max(Intento.puntaje))
        .filter(Intento.usuario_id == usuario.id)
        .group_by(Intento.cuestionario_id)
        .all()
    )

    cuestionarios = []
    for leccion in lecciones:
        if leccion.cuestionario:
            mejor = mejores.get(leccion.cuestionario.id)
            cuestionarios.append(
                MejorPuntaje(
                    cuestionario_id=leccion.cuestionario.id,
                    titulo=leccion.cuestionario.titulo,
                    leccion_id=leccion.id,
                    mejor_puntaje=float(mejor) if mejor is not None else None,
                )
            )

    total = len(lecciones)
    completadas = len(completadas_ids)
    porcentaje = round((completadas / total) * 100, 1) if total else 0.0

    return ProgresoCurso(
        curso_id=curso.id,
        titulo=curso.titulo,
        total_lecciones=total,
        lecciones_completadas=completadas,
        porcentaje=porcentaje,
        lecciones=[
            LeccionConEstado(
                leccion_id=leccion.id,
                titulo=leccion.titulo,
                orden=leccion.orden,
                completada=leccion.id in completadas_ids,
            )
            for leccion in lecciones
        ],
        cuestionarios=cuestionarios,
    )


def resumen_global(db: Session, usuario: Usuario) -> list[ResumenCurso]:
    """Los cursos donde el usuario tiene actividad (lecciones completadas),
    con su porcentaje de avance. Alimenta la vista global 'Mi progreso'."""
    cursos_con_actividad = (
        db.query(Curso)
        .join(Leccion, Leccion.curso_id == Curso.id)
        .join(Progreso, Progreso.leccion_id == Leccion.id)
        .filter(Progreso.usuario_id == usuario.id)
        .distinct()
        .all()
    )

    resumen = []
    for curso in cursos_con_actividad:
        total, completadas, porcentaje = _conteo_curso(db, usuario, curso.id)
        resumen.append(
            ResumenCurso(
                curso_id=curso.id,
                titulo=curso.titulo,
                nivel=curso.nivel.value,
                total_lecciones=total,
                lecciones_completadas=completadas,
                porcentaje=porcentaje,
            )
        )
    return resumen
