from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from app import models  # registra todos los modelos en la Base (necesario para create_all)

# Crea en la base de datos las tablas que aún no existan (no toca las existentes)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduLogic API")


@app.get("/health")
def health():
    return {"estado": "ok"}


@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    # Ejecutar una consulta simple para verificar la conexión a la base de datos
    db.execute(text("SELECT 1"))
    return {"base_de_datos": "conectada"}
