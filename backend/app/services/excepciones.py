"""Excepciones propias del dominio de EduLogic.

La capa de servicios (logica de negocio) lanza ESTAS excepciones, no
HTTPException: la logica no deberia saber que existe HTTP. Los manejadores
globales registrados en main.py las traducen a respuestas JSON con el
formato unico de error de la API: {"detail": "<mensaje>"}.

Los routers, por ser la capa HTTP, si pueden seguir usando HTTPException
directamente — producen exactamente el mismo formato.
"""


class ErrorDeDominio(Exception):
    """Base de todas las excepciones del dominio. No se lanza directamente."""

    codigo_http = 500


class RecursoNoEncontrado(ErrorDeDominio):
    """El recurso pedido no existe (curso, leccion, cuestionario...)."""

    codigo_http = 404


class SinPermisos(ErrorDeDominio):
    """El usuario esta autenticado pero no puede hacer esta operacion."""

    codigo_http = 403


class ReglaDeNegocioViolada(ErrorDeDominio):
    """La peticion es valida en forma pero rompe una regla de EduLogic
    (ej: pregunta sin opcion correcta, intento incompleto)."""

    codigo_http = 400


class ConflictoDeEstado(ErrorDeDominio):
    """La operacion choca con el estado actual de los datos
    (ej: email ya registrado, leccion que ya tiene cuestionario)."""

    codigo_http = 409
