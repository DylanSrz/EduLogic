import { apiGet } from "../api.js";
import { escapeHTML } from "../ui.js";

export async function vistaCursos(app) {
    app.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.appendChild(crearHero());
    contenedor.appendChild(crearSeccionCursos());

    app.appendChild(contenedor);

    const contenido = document.getElementById("cursos-contenido");
    mostrarLoading(contenido);

    try {
        const cursos = await apiGet("/cursos");
        renderizarConDatos(contenido, cursos, vistaCursos, app);
    } catch {
        renderizarError(contenido, vistaCursos, app);
    }
}

function crearHero() {
    const hero = document.createElement("section");
    hero.className = "relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden";

    const patron = document.createElement("div");
    patron.className = "absolute inset-0 opacity-10";
    patron.style.backgroundImage = `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px)`;
    patron.style.backgroundSize = "40px 40px";
    hero.appendChild(patron);

    const contenido = document.createElement("div");
    contenido.className = "relative max-w-6xl mx-auto px-4 py-20 md:py-24 text-center";

    contenido.innerHTML = `
        <span class="inline-block bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Aprendizaje sin límites
        </span>
        <h2 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Catálogo de cursos
        </h2>
        <p class="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Explora nuestra oferta educativa y fortalece tus habilidades en lógica, 
            matemáticas y programación con contenido diseñado para todos los niveles.
        </p>
    `;

    hero.appendChild(contenido);
    return hero;
}

function crearSeccionCursos() {
    const seccion = document.createElement("section");
    seccion.className = "max-w-6xl mx-auto px-4 py-12";
    seccion.innerHTML = '<div id="cursos-contenido"></div>';
    return seccion;
}

function mostrarLoading(container) {
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${Array.from({ length: 6 }, () => `
                <div class="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                    <div class="h-2 bg-gray-200 w-full"></div>
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-5">
                            <div class="h-5 bg-gray-200 rounded-full w-24"></div>
                        </div>
                        <div class="h-6 bg-gray-200 rounded w-full mb-3"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                        <div class="h-5 bg-blue-200 rounded w-28"></div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

function renderizarConDatos(container, cursos, vistaFn, app) {
    container.innerHTML = "";

    if (cursos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-24">
                <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <svg class="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Aún no hay cursos disponibles</h3>
                <p class="text-gray-500 max-w-md mx-auto">Vuelve pronto, estamos preparando nuevo contenido para ti.</p>
            </div>
        `;
        return;
    }

    const barraSuperior = document.createElement("div");
    barraSuperior.className = "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8";

    const contador = document.createElement("div");
    contador.className = "flex items-center gap-2 text-gray-600";
    contador.innerHTML = `
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
        <span class="font-medium" id="total-cursos">${cursos.length} curso${cursos.length !== 1 ? "s" : ""}</span>
        <span class="text-gray-400 text-sm">disponibles</span>
    `;
    barraSuperior.appendChild(contador);

    const buscador = document.createElement("div");
    buscador.className = "relative w-full sm:w-72";
    buscador.innerHTML = `
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
    `;
    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Buscar curso...";
    input.className = "w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-sm";
    buscador.appendChild(input);
    barraSuperior.appendChild(buscador);

    container.appendChild(barraSuperior);

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    container.appendChild(grid);

    function filtrarYRenderizar(filtro) {
        grid.innerHTML = "";

        const filtrados = filtro
            ? cursos.filter(c => c.titulo.toLowerCase().includes(filtro.toLowerCase()))
            : cursos;

        if (filtrados.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                    <p class="text-gray-500 font-medium">No se encontraron cursos con ese título.</p>
                </div>
            `;
            return;
        }

        const contadorTotal = document.getElementById("total-cursos");
        if (contadorTotal) {
            contadorTotal.textContent = filtrados.length + " curso" + (filtrados.length !== 1 ? "s" : "");
        }

        filtrados.forEach((curso, i) => {
            const tarjeta = crearTarjeta(curso, i);
            grid.appendChild(tarjeta);
        });
    }

    input.addEventListener("input", function () {
        filtrarYRenderizar(this.value);
    });

    filtrarYRenderizar("");
}

function crearTarjeta(curso, indice) {
    const tarjeta = document.createElement("a");
    tarjeta.href = "#/cursos/" + curso.id;
    tarjeta.className = "group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden";
    tarjeta.style.animation = "fadeInUp 0.5s ease-out " + (indice * 0.08) + "s both";

    tarjeta.innerHTML = `
        <div class="h-2 w-full ${colorNivelBorde(curso.nivel)}"></div>
        <div class="p-6">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 ${colorNivelFondo(curso.nivel)} ${colorNivelTexto(curso.nivel)}">
                ${iconoNivel(curso.nivel)}
                ${capitalizar(curso.nivel)}
            </span>
            <h3 class="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                ${escapeHTML(curso.titulo)}
            </h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                ${escapeHTML(curso.descripcion || "")}
            </p>
            <span class="inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
                Ver curso
                <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                </svg>
            </span>
        </div>
    `;

    return tarjeta;
}

function renderizarError(container, vistaFn, app) {
    container.innerHTML = `
        <div class="text-center py-24">
            <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <svg class="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Error al cargar los cursos</h3>
            <p class="text-gray-500 mb-8 max-w-md mx-auto">No pudimos conectar con el servidor. Verifica que el backend esté corriendo e inténtalo de nuevo.</p>
            <button class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all cursor-pointer font-medium" id="btn-reintentar">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Reintentar
            </button>
        </div>
    `;

    const btn = container.querySelector("#btn-reintentar");
    btn.addEventListener("click", function () {
        vistaFn(app);
    });
}

function iconoNivel(nivel) {
    switch (nivel) {
        case "basico":
            return '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>';
        case "intermedio":
            return '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
        case "avanzado":
            return '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
        default:
            return "";
    }
}

function colorNivelFondo(nivel) {
    switch (nivel) {
        case "basico": return "bg-green-50";
        case "intermedio": return "bg-amber-50";
        case "avanzado": return "bg-red-50";
        default: return "bg-blue-50";
    }
}

function colorNivelTexto(nivel) {
    switch (nivel) {
        case "basico": return "text-green-700";
        case "intermedio": return "text-amber-700";
        case "avanzado": return "text-red-700";
        default: return "text-blue-700";
    }
}

function colorNivelBorde(nivel) {
    switch (nivel) {
        case "basico": return "bg-green-500";
        case "intermedio": return "bg-amber-500";
        case "avanzado": return "bg-red-500";
        default: return "bg-blue-500";
    }
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

if (!document.getElementById("cursos-estilos")) {
    const estiloAnimacion = document.createElement("style");
    estiloAnimacion.id = "cursos-estilos";
    estiloAnimacion.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(estiloAnimacion);
}
