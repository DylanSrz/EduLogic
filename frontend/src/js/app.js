import { registrarRuta, navegar } from "./router.js";
import { vistaInicio } from "./vistas/inicio.js";
import { vistaLogin } from "./vistas/login.js";
import { vistaCursos } from "./vistas/cursos.js";
import { vistaDetalleCurso } from "./vistas/detalleCurso.js";

registrarRuta("/", vistaInicio);
registrarRuta("/login", vistaLogin);
registrarRuta("/cursos", vistaCursos);
registrarRuta("/cursos/:id", vistaDetalleCurso);

window.addEventListener("hashchange", navegar);
window.addEventListener("DOMContentLoaded", navegar);