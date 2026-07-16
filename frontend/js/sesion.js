// Manejo de la sesión en el navegador y del header dinámico.
// api.js se encarga SOLO de hablar con el backend (módulo de Axel, #26);
// este módulo guarda quién está logueado y adapta la interfaz a la sesión.

import { borrarToken, obtenerToken } from "./api.js";

export function guardarUsuario(usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
}

export function obtenerUsuario() {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
}

export function haySesion() {
    return !!obtenerToken();
}

export function obtenerRol() {
    const usuario = obtenerUsuario();
    return usuario ? usuario.rol : null;
}

export function cerrarSesion() {
    borrarToken();
    localStorage.removeItem("usuario");
}

// Navega dejando opcionalmente un "mensaje flash": un aviso de una sola
// lectura que la siguiente vista muestra (ej. "Cuenta creada, inicia sesión").
export function navegarA(ruta, mensaje = "") {
    if (mensaje) {
        sessionStorage.setItem("mensajeFlash", mensaje);
    }
    window.location.hash = ruta;
}

export function obtenerMensajeFlash() {
    const mensaje = sessionStorage.getItem("mensajeFlash");
    sessionStorage.removeItem("mensajeFlash");
    return mensaje;
}

export function actualizarHeader() {
    const nav = document.querySelector("header nav");
    if (!nav) return;

    nav.innerHTML = "";

    const enlaceInicio = document.createElement("a");
    enlaceInicio.href = "#/";
    enlaceInicio.className = "text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors";
    enlaceInicio.textContent = "Inicio";
    nav.appendChild(enlaceInicio);

    const enlaceCursos = document.createElement("a");
    enlaceCursos.href = "#/cursos";
    enlaceCursos.className = "text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors";
    enlaceCursos.textContent = "Cursos";
    nav.appendChild(enlaceCursos);

    const usuario = obtenerUsuario();
    if (usuario) {
        const spanUsuario = document.createElement("span");
        spanUsuario.className = "text-gray-700 font-medium px-2 py-2";
        // textContent (nunca innerHTML) porque el nombre lo escribió el usuario
        spanUsuario.textContent = `${usuario.nombre} (${usuario.rol})`;
        nav.appendChild(spanUsuario);

        const btnLogout = document.createElement("button");
        btnLogout.className = "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer";
        btnLogout.textContent = "Cerrar sesión";
        btnLogout.addEventListener("click", () => {
            cerrarSesion();
            actualizarHeader();
            navegarA("/");
        });
        nav.appendChild(btnLogout);
    } else {
        const enlaceLogin = document.createElement("a");
        enlaceLogin.href = "#/login";
        enlaceLogin.className = "text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors";
        enlaceLogin.textContent = "Iniciar sesión";
        nav.appendChild(enlaceLogin);

        const enlaceRegistro = document.createElement("a");
        enlaceRegistro.href = "#/registro";
        enlaceRegistro.className = "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors";
        enlaceRegistro.textContent = "Regístrate";
        nav.appendChild(enlaceRegistro);
    }
}
