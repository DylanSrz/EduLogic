from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from app import models  # registra todos los modelos en la Base (necesario para create_all)
from app.routers.auth import router as auth_router
from app.routers.cursos import router as cursos_router
from app.routers.cuestionarios import router as cuestionarios_router

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


@app.get("/health")
def health():
    return {"estado": "ok"}


@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    # Ejecutar una consulta simple para verificar la conexión a la base de datos
    db.execute(text("SELECT 1"))
    return {"base_de_datos": "conectada"}
