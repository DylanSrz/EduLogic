import { registrarRuta, navegar } from "./router.js";
import { actualizarHeader } from "./sesion.js";
import { vistaInicio } from "./vistas/inicio.js";
import { vistaLogin } from "./vistas/login.js";
import { vistaRegistro } from "./vistas/registro.js";
import { vistaCursos } from "./vistas/cursos.js";
import { vistaDetalleCurso } from "./vistas/detalleCurso.js";
import { vistaLeccion } from "./vistas/lecciones.js";
import { vistaCuestionario } from "./vistas/cuestionarios.js";
import { vistaProgreso } from "./vistas/progreso.js";
import { vistaPanelProfesor } from "./vistas/panelProfesor.js";
import { vistaPanelAdmin } from "./vistas/panelAdmin.js";

registrarRuta("/", vistaInicio);
registrarRuta("/login", vistaLogin);
registrarRuta("/registro", vistaRegistro);
registrarRuta("/cursos", vistaCursos);
registrarRuta("/cursos/:id", vistaDetalleCurso);
registrarRuta("/lecciones/:id", vistaLeccion);
registrarRuta("/cuestionarios/:id", vistaCuestionario);
registrarRuta("/mi-progreso", vistaProgreso);
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
