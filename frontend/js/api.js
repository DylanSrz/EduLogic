const API_BASE = "http://localhost:8000";

async function fetchAPI(endpoint, opciones = {}) {
    const token = obtenerToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers
    };

    const respuesta = await fetch(`${API_BASE}${endpoint}`, {
        ...opciones,
        headers
    });

    if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({ detail: "Error desconocido" }));
        throw new Error(error.detail || `Error ${respuesta.status}`);
    }

    return respuesta.json();
}

export async function apiPost(endpoint, datos) {
    return fetchAPI(endpoint, {
        method: "POST",
        body: JSON.stringify(datos)
    });
}

export async function apiGet(endpoint) {
    return fetchAPI(endpoint, { method: "GET" });
}

export function guardarToken(token) {
    localStorage.setItem("token", token);
}

export function obtenerToken() {
    return localStorage.getItem("token");
}

export function borrarToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
}

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
    return usuario?.rol || null;
}

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

    // Limpiar el nav completamente para reconstruir
    nav.innerHTML = "";

    // Siempre agregamos los enlaces principales
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
        // Si hay sesión activa, mostrar nombre, rol y botón de cerrar sesión
        const spanUsuario = document.createElement("span");
        spanUsuario.className = "text-gray-700 font-medium px-2 py-2";
        spanUsuario.textContent = `${usuario.nombre} (${usuario.rol})`;
        nav.appendChild(spanUsuario);

        const btnLogout = document.createElement("button");
        btnLogout.id = "btnLogout";
        btnLogout.className = "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer";
        btnLogout.textContent = "Cerrar sesión";
        btnLogout.addEventListener("click", () => {
            borrarToken();
            actualizarHeader();
            navegarA("/");
        });
        nav.appendChild(btnLogout);
    } else {
        // Si no hay sesión, mostrar "Iniciar sesión" y "Regístrate"
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

export function requerirAutenticacion() {
    if (!haySesion()) {
        navegarA("/login");
        return false;
    }
    return true;
}

export function requerirRol(...rolesPermitidos) {
    if (!requerirAutenticacion()) return false;
    const rol = obtenerRol();
    if (!rolesPermitidos.includes(rol)) {
        navegarA("/");
        return false;
    }
    return true;
}