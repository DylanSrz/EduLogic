import bcrypt


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
