from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from app.services.seguridad import SECRET_KEY, ALGORITMO
import jwt

esquema_bearer = HTTPBearer()


def usuario_actual(
        credenciales: HTTPAuthorizationCredentials = Depends(esquema_bearer),
        db: Session = Depends(get_db)
) -> Usuario:
    """
    Obtiene el usuario actual a partir del token de autorización.

    Args:
        credenciales (HTTPAuthorizationCredentials): Credenciales de autorización.
        db (Session): Sesión de la base de datos.

    Returns:
        Usuario: El usuario actual.

    Raises:
        HTTPException: Si el token es inválido o el usuario no existe.
    """
    try:
        payload = jwt.decode(credenciales.credentials,
                             SECRET_KEY, algorithms=[ALGORITMO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token ha expirado."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido."
        )

    usuario = db.get(Usuario, int(payload.get("sub")))

    if not usuario or not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no válido o cuenta desactivada"
        )

    return usuario


def requiere_rol(*roles: str):
    def verificador(usuario: Usuario = Depends(usuario_actual)) -> Usuario:
        if usuario.rol.value not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para realizar esta acción.",
            )
        return usuario
    return verificador
