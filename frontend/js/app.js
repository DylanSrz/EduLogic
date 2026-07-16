import { registrarRuta, navegar } from "./router.js";
import { actualizarHeader } from "./sesion.js";
import { vistaInicio } from "./vistas/inicio.js";
import { vistaLogin } from "./vistas/login.js";
import { vistaRegistro } from "./vistas/registro.js";
import { vistaCursos } from "./vistas/cursos.js";
import { vistaDetalleCurso } from "./vistas/detalleCurso.js";

registrarRuta("/", vistaInicio);
registrarRuta("/login", vistaLogin);
registrarRuta("/registro", vistaRegistro);
registrarRuta("/cursos", vistaCursos);
registrarRuta("/cursos/:id", vistaDetalleCurso);

// El header se reconstruye en cada navegación: muestra login/registro
// sin sesión, o el nombre del usuario y "cerrar sesión" con ella.
window.addEventListener("hashchange", () => {
    navegar();
    actualizarHeader();
});

window.addEventListener("DOMContentLoaded", () => {
    navegar();
    actualizarHeader();
});
