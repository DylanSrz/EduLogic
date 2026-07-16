# Importar aquí TODOS los modelos es obligatorio: así quedan registrados en la Base
# y Base.metadata.create_all() puede crear sus tablas. Un modelo que no se importe
# aquí, no existe para SQLAlchemy.

from app.models.usuario import Usuario, RolUsuario
from app.models.curso import Curso, NivelCurso
from app.models.leccion import Leccion
from app.models.cuestionario import Cuestionario
from app.models.pregunta import Pregunta
from app.models.opcion import Opcion
from app.models.intento import Intento, RespuestaIntento
from app.models.progreso import Progreso
