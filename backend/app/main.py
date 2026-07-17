import logging

from fastapi import FastAPI, Depends, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from app import models  # registra todos los modelos en la Base (necesario para create_all)
from app.routers.auth import router as auth_router
from app.routers.cursos import router as cursos_router
from app.routers.cuestionarios import router as cuestionarios_router
from app.routers.intentos import router as intentos_router
from app.routers.lecciones import router as lecciones_router
from app.services.excepciones import ErrorDeDominio

# El log del servidor: aqui SI queda el detalle real de los errores internos
# (el cliente nunca lo ve). En produccion este log es la caja negra del avion.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("edulogic")

# Crea en la base de datos las tablas que aún no existan (no toca las existentes)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduLogic API")

# CORS: orígenes autorizados a consumir la API desde el navegador.
# Al desplegar hay que agregar aquí el dominio del frontend en producción.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",  # Live Server
        "http://localhost:5500",  # mismo Live Server, pero es OTRO origen para el navegador
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(cursos_router)
app.include_router(cuestionarios_router)
app.include_router(intentos_router)
app.include_router(lecciones_router)


# ---------------------------------------------------------------------------
# Manejadores globales de errores.
#
# FORMATO UNICO DE ERROR DE LA API (decision documentada): {"detail": "<mensaje>"}.
# Es el formato nativo de FastAPI, el que ya producen todos los HTTPException
# de los routers y el que consume el frontend (api.js lee error.detail).
# Estos manejadores garantizan que TODAS las demas fuentes de error
# (excepciones de dominio, errores de validacion, fallos inesperados)
# respondan exactamente igual.
# ---------------------------------------------------------------------------


@app.exception_handler(ErrorDeDominio)
def manejar_error_de_dominio(request: Request, exc: ErrorDeDominio):
    """Traduce las excepciones de la capa de servicios a su respuesta HTTP."""
    return JSONResponse(
        status_code=exc.codigo_http,
        content={"detail": str(exc)},
    )


# Traducciones de los tipos de error mas comunes de Pydantic.
# ctx trae los valores del limite (min_length, ge, etc.) para armar el mensaje.
_TRADUCCIONES_VALIDACION = {
    "missing": lambda ctx: "es obligatorio",
    "string_too_short": lambda ctx: f"debe tener al menos {ctx.get('min_length')} caracteres",
    "string_too_long": lambda ctx: f"no puede superar {ctx.get('max_length')} caracteres",
    "too_short": lambda ctx: f"debe tener al menos {ctx.get('min_length')} elemento(s)",
    "greater_than_equal": lambda ctx: f"debe ser mayor o igual a {ctx.get('ge')}",
    "int_parsing": lambda ctx: "debe ser un número entero",
    "bool_parsing": lambda ctx: "debe ser verdadero o falso",
    "literal_error": lambda ctx: "no es un valor permitido",
    "json_invalid": lambda ctx: "el cuerpo de la petición no es JSON válido",
}


@app.exception_handler(RequestValidationError)
def manejar_error_de_validacion(request: Request, exc: RequestValidationError):
    """Convierte los 422 de Pydantic en mensajes en español entendibles."""
    mensajes = []
    for error in exc.errors():
        campo = ".".join(str(parte) for parte in error["loc"] if parte != "body")
        tipo = error["type"]
        ctx = error.get("ctx", {})

        if tipo in _TRADUCCIONES_VALIDACION:
            descripcion = _TRADUCCIONES_VALIDACION[tipo](ctx)
        elif "email" in error["msg"].lower():
            descripcion = "no tiene formato de correo válido"
        else:
            descripcion = error["msg"]  # ultimo recurso: el mensaje original

        mensajes.append(f"El campo '{campo}' {descripcion}." if campo else f"{descripcion}.")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": " ".join(mensajes)},
    )


@app.exception_handler(Exception)
def manejar_error_inesperado(request: Request, exc: Exception):
    """Red de seguridad: cualquier fallo no controlado responde 500 con
    mensaje neutro. El detalle real (traza completa) queda SOLO en el log
    del servidor — el cliente jamás ve trazas de Python ni SQL."""
    logger.error(
        "Error interno no controlado en %s %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Error interno del servidor."},
    )


@app.get("/health")
def health():
    return {"estado": "ok"}


@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    # Ejecutar una consulta simple para verificar la conexión a la base de datos
    db.execute(text("SELECT 1"))
    return {"base_de_datos": "conectada"}
