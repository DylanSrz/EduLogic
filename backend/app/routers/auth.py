from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import TokenRespuesta, UsuarioCrear, UsuarioRespuesta, LoginDatos
from app.services.seguridad import crear_token, hashear_contrasena, verificar_contrasena
from app.services.dependencias import usuario_actual

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/registro", response_model=UsuarioRespuesta, status_code=status.HTTP_201_CREATED)
def registrar_usuario(datos: UsuarioCrear, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario en la base de datos.

    Args:
        datos (UsuarioCrear): Datos del usuario a registrar.
        db (Session): Sesión de la base de datos.

    Returns:
        UsuarioRespuesta: Información del usuario registrado.
    """
    # Verificar si el email ya está registrado
    usuario_existente = db.query(Usuario).filter(
        Usuario.email == datos.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El email ya está registrado."
        )

    # Hashear la contraseña
    contrasena_hasheada = hashear_contrasena(datos.contrasena)

    # Crear el nuevo usuario
    nuevo_usuario = Usuario(
        nombre=datos.nombre,
        email=datos.email,
        contrasena_hash=contrasena_hasheada,
        rol=datos.rol
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario


@router.post("/login", response_model=TokenRespuesta)
def iniciar_sesion(datos: LoginDatos, db: Session = Depends(get_db)):
    """
    Inicia sesión para un usuario existente.

    Args:
        datos (LoginDatos): Datos de inicio de sesión del usuario.
        db (Session): Sesión de la base de datos.

    Returns:
        TokenRespuesta: Token de acceso y tipo de token.
    """
    # Verificar si el usuario existe y la contraseña es correcta
    usuario = db.query(Usuario).filter(
        Usuario.email == datos.email).first()
    if not usuario or not verificar_contrasena(datos.contrasena, usuario.contrasena_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas."
        )

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La cuenta esta desactivada."
        )

    # Crear el token de acceso
    token = crear_token({"sub": str(usuario.id), "rol": usuario.rol.value})

    return TokenRespuesta(access_token=token, usuario=usuario)


@router.get("/yo", response_model=UsuarioRespuesta)
def obtener_usuario_actual(usuario: Usuario = Depends(usuario_actual)):
    """
    Obtiene la información del usuario actualmente autenticado.

    Args:
        usuario (Usuario): Usuario autenticado.
    Returns:
        UsuarioRespuesta: Información del usuario autenticado.
    """
    return usuario
