import bcrypt
import jwt
import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITMO = "HS256"
EXPIRA_MINUTOS = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def hashear_contrasena(contrasena: str) -> str:
    """
    Hashea una contraseña utilizando bcrypt.

    Args:
        contrasena (str): La contraseña en texto plano.

    Returns:
        str: La contraseña hasheada.
    """
    return bcrypt.hashpw(contrasena.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verificar_contrasena(contrasena: str, hash_guardado: str) -> bool:
    """
    Verifica si una contraseña coincide con un hash guardado.

    Args:
        contrasena (str): La contraseña en texto plano.
        hash_guardado (str): El hash de la contraseña guardada.

    Returns:
        bool: True si la contraseña coincide, False en caso contrario.
    """
    return bcrypt.checkpw(contrasena.encode("utf-8"), hash_guardado.encode("utf-8"))


def crear_token(datos: dict) -> str:
    """
    Crea un token JWT con los datos proporcionados.

    Args:
        datos (dict): Los datos a incluir en el token.

    Returns:
        str: El token JWT generado.
    """
    copia = datos.copy()
    expiracion = datetime.now(timezone.utc) + timedelta(minutes=EXPIRA_MINUTOS)
    copia.update({"exp": expiracion})
    return jwt.encode(copia, SECRET_KEY, algorithm=ALGORITMO)
