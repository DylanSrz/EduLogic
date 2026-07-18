import { borrarToken, obtenerToken } from "./api.js";

const RUTAS_PROTEGIDAS_SESION = [
    { patron: "lecciones/:id" },
    { patron: "cuestionarios/:id" },
];

const RUTAS_PROTEGIDAS_ROL = {
    "mi-progreso": ["estudiante"],
    "panel-profesor": ["profesor", "admin"],
    "panel-admin": ["admin"],
};

function segmentos(patron) {
    return patron.split("/").filter(s => s !== "");
}

function coincidePatron(segHash, patrones) {
    for (const { patron } of patrones) {
        const segPatron = segmentos(patron);
        if (segHash.length !== segPatron.length) continue;
        let coincide = true;
        for (let i = 0; i < segPatron.length; i++) {
            if (segPatron[i].startsWith(":")) continue;
            if (segPatron[i] !== segHash[i]) { coincide = false; break; }
        }
        if (coincide) return true;
    }
    return false;
}

function coincideRol(segHash) {
    for (const [patron, roles] of Object.entries(RUTAS_PROTEGIDAS_ROL)) {
        const segPatron = segmentos(patron);
        if (segHash.length !== segPatron.length) continue;
        let coincide = true;
        for (let i = 0; i < segPatron.length; i++) {
            if (segPatron[i] !== segHash[i]) { coincide = false; break; }
        }
        if (coincide) return roles;
    }
    return null;
}

function leerPayload(token) {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
}

export function haySesion() {
    const token = obtenerToken();
    if (!token) return false;

    try {
        const payload = leerPayload(token);
        const ahora = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < ahora) {
            borrarToken();
            localStorage.removeItem("usuario");
            return false;
        }
        return true;
    } catch {
        borrarToken();
        localStorage.removeItem("usuario");
        return false;
    }
}

export function rolActual() {
    if (!haySesion()) return null;
    try {
        const payload = leerPayload(obtenerToken());
        return payload.rol || null;
    } catch {
        return null;
    }
}

export function guardarRutaDestino(ruta) {
    if (ruta && ruta !== "/login" && ruta !== "/registro") {
        sessionStorage.setItem("rutaDestino", ruta);
    }
}

export function obtenerRutaDestino() {
    const ruta = sessionStorage.getItem("rutaDestino");
    sessionStorage.removeItem("rutaDestino");
    return ruta;
}

export function verificarAcceso(hash) {
    const limpia = hash.split("?")[0];
    const segHash = segmentos(limpia);

    if (coincidePatron(segHash, RUTAS_PROTEGIDAS_SESION)) {
        if (!haySesion()) {
            guardarRutaDestino(limpia);
            return { permitido: false, redirect: "/login" };
        }
    }

    const rolesRequeridos = coincideRol(segHash);
    if (rolesRequeridos) {
        if (!haySesion()) {
            guardarRutaDestino(limpia);
            return { permitido: false, redirect: "/login" };
        }
        const rol = rolActual();
        if (!rolesRequeridos.includes(rol)) {
            return { permitido: false, sinPermisos: true };
        }
    }

    return { permitido: true };
}

export function guardarUsuario(usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
}

export function obtenerUsuario() {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
}

export function cerrarSesion() {
    borrarToken();
    localStorage.removeItem("usuario");
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

export function vistaSinPermisos(app) {
    app.innerHTML = "";
    const contenedor = document.createElement("div");
    contenedor.className = "flex flex-col items-center justify-center min-h-[60vh] text-center px-4";
    contenedor.innerHTML = `
        <h1 class="font-display text-8xl font-bold text-purple-300 mb-4 select-none">403</h1>
        <h2 class="font-display text-2xl font-bold text-gray-800 mb-2">Acceso denegado</h2>
        <p class="text-gray-500 mb-6">No tienes permisos para acceder a esta sección.</p>
        <a href="#/" class="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:scale-95 transition-all">
            Volver al inicio
        </a>
    `;
    app.appendChild(contenedor);
}

// Menú hamburguesa del header en pantallas pequeñas. Reutiliza el mismo
// <nav> que llena actualizarHeader(): en móvil se muestra como desplegable
// (clases hidden/flex) y en escritorio md:flex lo mantiene siempre visible.
// Se llama UNA sola vez al cargar la app: los enlaces internos cambian con
// cada sesión, por eso el cierre usa delegación sobre el nav.
export function iniciarMenuMovil() {
    const boton = document.getElementById("btn-menu-movil");
    const menu = document.getElementById("menu-principal");
    if (!boton || !menu) return;

    const iconoAbrir = boton.querySelector(".icono-abrir");
    const iconoCerrar = boton.querySelector(".icono-cerrar");

    function cerrarMenu() {
        menu.classList.add("hidden");
        menu.classList.remove("flex");
        boton.setAttribute("aria-expanded", "false");
        iconoAbrir.classList.remove("hidden");
        iconoCerrar.classList.add("hidden");
    }

    boton.addEventListener("click", () => {
        const estaAbierto = !menu.classList.contains("hidden");
        if (estaAbierto) {
            cerrarMenu();
            return;
        }
        menu.classList.remove("hidden");
        menu.classList.add("flex");
        boton.setAttribute("aria-expanded", "true");
        iconoAbrir.classList.add("hidden");
        iconoCerrar.classList.remove("hidden");
    });

    // Navegar (o cerrar sesión) desde el menú cierra el desplegable
    menu.addEventListener("click", (evento) => {
        if (evento.target.closest("a, button")) cerrarMenu();
    });
}

export function actualizarHeader() {
    const nav = document.querySelector("header nav");
    if (!nav) return;

    nav.innerHTML = "";

    const enlaceInicio = document.createElement("a");
    enlaceInicio.href = "#/";
    enlaceInicio.className = "font-semibold text-gray-600 hover:text-blue-700 px-3.5 py-2 rounded-full hover:bg-blue-50 transition-colors";
    enlaceInicio.textContent = "Inicio";
    nav.appendChild(enlaceInicio);

    const enlaceCursos = document.createElement("a");
    enlaceCursos.href = "#/cursos";
    enlaceCursos.className = "font-semibold text-gray-600 hover:text-blue-700 px-3.5 py-2 rounded-full hover:bg-blue-50 transition-colors";
    enlaceCursos.textContent = "Cursos";
    nav.appendChild(enlaceCursos);

    const sesion = haySesion();
    const rol = rolActual();

    if (sesion) {
        if (rol === "estudiante") {
            const enlaceProgreso = document.createElement("a");
            enlaceProgreso.href = "#/mi-progreso";
            enlaceProgreso.className = "font-semibold text-gray-600 hover:text-blue-700 px-3.5 py-2 rounded-full hover:bg-blue-50 transition-colors";
            enlaceProgreso.textContent = "Mi progreso";
            nav.appendChild(enlaceProgreso);
        }

        if (rol === "profesor" || rol === "admin") {
            const enlaceProf = document.createElement("a");
            enlaceProf.href = "#/panel-profesor";
            enlaceProf.className = "font-semibold text-gray-600 hover:text-blue-700 px-3.5 py-2 rounded-full hover:bg-blue-50 transition-colors";
            enlaceProf.textContent = "Panel profesor";
            nav.appendChild(enlaceProf);
        }

        if (rol === "admin") {
            const enlaceAdmin = document.createElement("a");
            enlaceAdmin.href = "#/panel-admin";
            enlaceAdmin.className = "font-semibold text-gray-600 hover:text-blue-700 px-3.5 py-2 rounded-full hover:bg-blue-50 transition-colors";
            enlaceAdmin.textContent = "Panel admin";
            nav.appendChild(enlaceAdmin);
        }

        const usuario = obtenerUsuario();
        const spanUsuario = document.createElement("span");
        spanUsuario.className = "inline-flex items-center justify-center bg-gray-100 text-gray-700 font-bold text-xs px-3 py-1.5 rounded-full";
        spanUsuario.textContent = `${usuario ? usuario.nombre : ""} (${rol})`;
        nav.appendChild(spanUsuario);

        const btnLogout = document.createElement("button");
        btnLogout.className = "bg-red-500 text-white font-bold px-4 py-2 rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:scale-95 transition-all cursor-pointer";
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
        enlaceLogin.className = "font-semibold text-gray-600 hover:text-blue-700 px-3.5 py-2 rounded-full hover:bg-blue-50 transition-colors";
        enlaceLogin.textContent = "Iniciar sesión";
        nav.appendChild(enlaceLogin);

        const enlaceRegistro = document.createElement("a");
        enlaceRegistro.href = "#/registro";
        enlaceRegistro.className = "bg-blue-600 text-white font-bold px-5 py-2 rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:scale-95 transition-all text-center";
        enlaceRegistro.textContent = "Regístrate";
        nav.appendChild(enlaceRegistro);
    }
}
