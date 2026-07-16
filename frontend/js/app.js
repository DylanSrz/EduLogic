import { registrarRuta, navegar } from "./router.js";
import { vistaInicio } from "./vistas/inicio.js";
import { vistaLogin } from "./vistas/login.js";
import { vistaRegistro } from "./vistas/registro.js";
import { vistaCursos } from "./vistas/cursos.js";
import { vistaDetalleCurso } from "./vistas/detalleCurso.js";
import { vistaPanelProfesor } from "./vistas/panelProfesor.js";
import { vistaPanelAdmin } from "./vistas/panelAdmin.js";
import { haySesion, obtenerUsuario, borrarToken, obtenerRol, actualizarHeader, navegarA, obtenerMensajeFlash } from "./api.js";

function inicializarHeader() {
    actualizarHeader();
}

registrarRuta("/", vistaInicio);
registrarRuta("/login", vistaLogin);
registrarRuta("/registro", vistaRegistro);
registrarRuta("/cursos", vistaCursos);
registrarRuta("/cursos/:id", vistaDetalleCurso);
registrarRuta("/panel-profesor", vistaPanelProfesor);
registrarRuta("/panel-admin", vistaPanelAdmin);

window.addEventListener("hashchange", () => {
    navegar();
    actualizarHeader();
});

window.addEventListener("DOMContentLoaded", () => {
    navegar();
    actualizarHeader();
});

export { inicializarHeader, navegarA, obtenerMensajeFlash };