import { apiGet } from "../api.js";
import { escapeHTML } from "../ui.js";

export async function vistaProgreso(app) {

    app.innerHTML = "";
    mostrarLoading(app);

    let progreso;

    try {
        progreso = await apiGet("/progreso/resumen");
    }

    catch (error) {
        mostrarError(app, error);
        return;
    }

    renderizar(app, progreso);
}

// =========================================================================
//  Piezas decorativas y reutilizables
// =========================================================================

// Capa de fondo: blobs de color muy sutiles + malla de puntos.
// Da "composicion" a la pagina sin recargarla. Va detras del contenido.
function fondoDecorativo() {
    return `
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute -top-24 -left-32 w-[30rem] h-[30rem] bg-blue-300/25 rounded-full blur-3xl"></div>
            <div class="absolute top-32 -right-40 w-[32rem] h-[32rem] bg-indigo-300/25 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] bg-violet-300/20 rounded-full blur-3xl"></div>
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(15,23,42,0.045) 1px, transparent 0); background-size: 32px 32px;"></div>
        </div>
    `;
}

// Placeholder elegante y claramente marcado para reemplazar por una imagen real.
function placeholderImagen(clasesExtra, etiqueta) {
    return `
        <div class="${clasesExtra} rounded-3xl border-2 border-dashed border-slate-200 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-slate-300">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="text-xs font-medium text-slate-400">${etiqueta}</span>
        </div>
    `;
}

// Anillo de progreso circular con CSS puro (conic-gradient), sin librerias.
function anilloProgreso(porcentaje) {
    return `
        <div class="relative w-44 h-44 rounded-full shrink-0 drop-shadow-xl"
             style="background: conic-gradient(#ffffff ${porcentaje}%, rgba(255,255,255,0.15) ${porcentaje}%);">
            <div class="absolute inset-[13px] rounded-full bg-indigo-700 flex flex-col items-center justify-center">
                <span class="text-4xl font-bold text-white leading-none">${porcentaje}<span class="text-xl align-top">%</span></span>
                <span class="mt-1 text-[11px] font-medium uppercase tracking-wider text-blue-200">Progreso general</span>
            </div>
        </div>
    `;
}

// Hero superior: panel de gradiente con anillo, resumen humano y decoracion.
function heroHTML(promedio, leccionesCompletadas, totalLecciones, cursosActivos) {
    return `
        <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white shadow-2xl shadow-indigo-600/25">
            <div class="pointer-events-none absolute -top-16 -right-10 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
            <div class="pointer-events-none absolute -bottom-24 left-10 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div class="pointer-events-none absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 26px 26px;"></div>

            <div class="relative px-8 py-12 md:px-12 md:py-14">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-10">

                    <div class="text-center md:text-left max-w-xl">
                        <span class="inline-flex items-center gap-2 text-xs font-semibold text-white/90 bg-white/10 ring-1 ring-white/20 backdrop-blur px-3 py-1 rounded-full">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                            Panel del estudiante
                        </span>

                        <h1 class="text-4xl md:text-5xl font-bold mt-5 leading-tight tracking-tight">
                            Mi progreso
                        </h1>

                        <p class="text-blue-100 text-lg mt-4 leading-relaxed">
                            Has completado <span class="font-semibold text-white">${leccionesCompletadas}</span>
                            de ${totalLecciones} lecciones en ${cursosActivos}
                            ${cursosActivos === 1 ? "curso" : "cursos"}. Sigue avanzando a tu ritmo.
                        </p>
                    </div>

                    <div class="flex justify-center">
                        ${anilloProgreso(promedio)}
                    </div>

                </div>
            </div>
        </section>
    `;
}

// Tile de estadistica con glassmorphism ligero e icono.
function tileEstadistica(etiqueta, valor, color, iconoPath) {
    const acento = {
        blue: "from-blue-500 to-indigo-500 text-blue-600 bg-blue-50",
        green: "from-emerald-500 to-teal-500 text-emerald-600 bg-emerald-50",
        purple: "from-violet-500 to-purple-500 text-violet-600 bg-violet-50",
    }[color];

    const chip = acento.split(" ").slice(2).join(" "); // text + bg

    return `
        <div class="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-slate-200/50 p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">${etiqueta}</p>
                    <p class="text-4xl font-bold text-slate-900 mt-2 tracking-tight">${valor}</p>
                </div>
                <div class="w-11 h-11 rounded-xl ${chip} flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">${iconoPath}</svg>
                </div>
            </div>
        </div>
    `;
}

// Tarjeta de curso rediseñada.
function tarjetaCurso(curso, indice) {
    const pct = Math.round(curso.porcentaje);
    const completo = pct >= 100;

    return `
        <article
            class="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            style="animation: fadeInUp 0.5s ease-out ${indice * 0.07}s both;"
        >
            <div class="p-6 md:p-7">

                <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                        <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${nivelFondo(curso.nivel)} ${nivelTexto(curso.nivel)}">
                            <span class="w-1.5 h-1.5 rounded-full ${nivelBorde(curso.nivel)}"></span>
                            ${escapeHTML(capitalizar(curso.nivel))}
                        </span>
                        <h3 class="text-lg font-bold text-slate-900 mt-3 leading-snug group-hover:text-indigo-600 transition-colors">
                            ${escapeHTML(curso.titulo)}
                        </h3>
                    </div>

                    <div class="shrink-0 text-right leading-none">
                        <span class="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">${pct}%</span>
                    </div>
                </div>

                <div class="mt-5">
                    <div class="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                        <span class="flex items-center gap-1.5">
                            ${completo
                                ? '<svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg> Completado'
                                : "Progreso"}
                        </span>
                        <span>${curso.lecciones_completadas} / ${curso.total_lecciones} lecciones</span>
                    </div>
                    <div class="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                            class="h-full rounded-full ${completo ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"} shadow-sm shadow-indigo-500/30 transition-all duration-700"
                            style="width: ${curso.porcentaje}%"
                        ></div>
                    </div>
                </div>

                <a
                    href="#/cursos/${curso.curso_id}"
                    class="mt-6 w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl active:scale-[0.98] transition-all"
                >
                    ${completo ? "Repasar curso" : "Continuar aprendiendo"}
                    <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>

            </div>
        </article>
    `;
}

// =========================================================================
//  Estados
// =========================================================================

function mostrarLoading(app) {

    const contenedor = document.createElement("div");
    contenedor.className = "relative min-h-full overflow-hidden bg-slate-50";

    contenedor.innerHTML = `
        ${fondoDecorativo()}
        <div class="relative max-w-6xl mx-auto px-6 py-10 md:py-14">
            <div class="rounded-3xl bg-slate-200/70 animate-pulse h-60 md:h-64"></div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 -mt-12 relative z-10 px-1">
                ${Array.from({ length: 3 }, () => `
                    <div class="bg-white/80 border border-white/60 rounded-2xl shadow-xl shadow-slate-200/50 p-6 animate-pulse">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="h-4 bg-slate-200 rounded w-24 mb-4"></div>
                                <div class="h-9 bg-slate-200 rounded w-16"></div>
                            </div>
                            <div class="w-11 h-11 bg-slate-200 rounded-xl"></div>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div class="mt-16">
                <div class="h-8 w-44 bg-slate-200 rounded animate-pulse mb-8"></div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${Array.from({ length: 4 }, () => `
                        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 animate-pulse">
                            <div class="flex items-start justify-between mb-6">
                                <div>
                                    <div class="h-6 bg-slate-200 rounded-full w-20 mb-3"></div>
                                    <div class="h-6 bg-slate-200 rounded w-44"></div>
                                </div>
                                <div class="h-8 bg-slate-200 rounded w-14"></div>
                            </div>
                            <div class="h-2.5 bg-slate-200 rounded-full mb-6"></div>
                            <div class="h-11 bg-slate-200 rounded-xl w-full"></div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;

    app.appendChild(contenedor);
}

function mostrarError(app, error) {

    app.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.className = "relative min-h-full overflow-hidden bg-slate-50 flex items-center justify-center px-6 py-24";

    contenedor.innerHTML = `
        ${fondoDecorativo()}
        <div class="relative text-center max-w-md bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-slate-200/50 px-8 py-12">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
            </div>

            <h2 class="text-2xl font-bold text-slate-800 mb-2">
                Error al cargar el progreso
            </h2>

            <p class="text-slate-500 mb-8">
                ${escapeHTML(error.message)}
            </p>

            <button
                id="btn-reintentar"
                class="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-slate-800 active:scale-95 transition-all cursor-pointer font-medium"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Reintentar
            </button>
        </div>
    `;

    app.appendChild(contenedor);

    contenedor.querySelector("#btn-reintentar").addEventListener("click", () => {
        vistaProgreso(app);
    });
}

function mostrarEstadoVacio(app) {

    const contenedor = document.createElement("div");
    contenedor.className = "relative min-h-full overflow-hidden bg-slate-50";

    contenedor.innerHTML = `
        ${fondoDecorativo()}
        <div class="relative max-w-4xl mx-auto px-6 py-16 md:py-20">

            <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white shadow-2xl shadow-indigo-600/25 px-8 py-12 md:px-12 text-center">
                <div class="pointer-events-none absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 26px 26px;"></div>
                <div class="relative">
                    <span class="inline-flex items-center gap-2 text-xs font-semibold text-white/90 bg-white/10 ring-1 ring-white/20 backdrop-blur px-3 py-1 rounded-full">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                        Panel del estudiante
                    </span>
                    <h1 class="text-4xl md:text-5xl font-bold mt-5 leading-tight tracking-tight">Mi progreso</h1>
                    <p class="text-blue-100 text-lg mt-4 max-w-lg mx-auto">
                        Aquí verás tu avance en cuanto empieces tu primer curso.
                    </p>
                </div>
            </section>

            <div class="relative z-10 -mt-10 max-w-xl mx-auto">
                <div class="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-slate-200/50 px-8 py-12 text-center">
                    ${placeholderImagen("w-40 h-40 mx-auto mb-8", "Ilustración")}

                    <h2 class="text-2xl font-bold text-slate-900 mb-3">
                        Aún no tienes progreso
                    </h2>

                    <p class="text-slate-500 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                        Empieza un curso y aquí podrás seguir tu avance lección a lección.
                    </p>

                    <a
                        href="#/cursos"
                        class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl shadow-sm active:scale-95 transition-all"
                    >
                        Explorar cursos
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            </div>

        </div>
    `;

    app.appendChild(contenedor);
}

function renderizar(app, progreso) {

    app.innerHTML = "";

    if (progreso.length === 0) {
        mostrarEstadoVacio(app);
        return;
    }

    const cursosActivos = progreso.length;

    const leccionesCompletadas = progreso.reduce(
        (total, curso) => total + curso.lecciones_completadas,
        0
    );

    const totalLecciones = progreso.reduce(
        (total, curso) => total + curso.total_lecciones,
        0
    );

    const progresoPromedio = Math.round(
        progreso.reduce((total, curso) => total + curso.porcentaje, 0) /
        cursosActivos
    );

    const cursosCompletados = progreso.filter(
        (curso) => curso.porcentaje >= 100
    ).length;

    const contenedor = document.createElement("div");
    contenedor.className = "relative min-h-full overflow-hidden bg-slate-50";

    contenedor.innerHTML = `
        ${fondoDecorativo()}

        <div class="relative max-w-6xl mx-auto px-6 py-10 md:py-14">

            ${heroHTML(progresoPromedio, leccionesCompletadas, totalLecciones, cursosActivos)}

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 -mt-12 relative z-10 px-1">
                ${tileEstadistica("Cursos activos", cursosActivos, "blue",
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>')}
                ${tileEstadistica("Lecciones completadas", leccionesCompletadas, "green",
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>')}
                ${tileEstadistica("Cursos completados", cursosCompletados, "purple",
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>')}
            </div>

            <div class="mt-16">
                <div class="flex items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Tus cursos</h2>
                        <p class="text-slate-500 mt-1">Continúa justo donde lo dejaste.</p>
                    </div>
                    <span class="hidden sm:inline-flex items-center text-sm font-semibold text-slate-500 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 shadow-sm">
                        ${cursosActivos} en curso
                    </span>
                </div>

                <div id="lista-progreso" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${progreso.map((curso, i) => tarjetaCurso(curso, i)).join("")}
                </div>
            </div>

            <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-16 px-8 py-10 md:px-12">
                <div class="pointer-events-none absolute -top-16 -right-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div class="relative grid md:grid-cols-[1fr_auto] items-center gap-8">
                    <div class="text-center md:text-left">
                        <h3 class="text-2xl font-bold tracking-tight">¿Listo para el siguiente reto?</h3>
                        <p class="text-slate-300 mt-2 max-w-md">
                            Descubre nuevos cursos y sigue sumando lecciones a tu progreso.
                        </p>
                        <a
                            href="#/cursos"
                            class="inline-flex items-center gap-2 mt-6 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 active:scale-95 transition-all shadow-lg"
                        >
                            Explorar catálogo
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                    ${placeholderImagen("hidden md:flex w-48 h-32 border-white/20 bg-white/5 text-white/30", "Ilustración")}
                </div>
            </section>

        </div>
    `;

    app.appendChild(contenedor);
}

// =========================================================================
//  Helpers de nivel (colores semanticos, consistentes con el catalogo)
// =========================================================================

function nivelFondo(nivel) {
    switch (nivel) {
        case "basico": return "bg-emerald-50";
        case "intermedio": return "bg-amber-50";
        case "avanzado": return "bg-rose-50";
        default: return "bg-blue-50";
    }
}

function nivelTexto(nivel) {
    switch (nivel) {
        case "basico": return "text-emerald-700";
        case "intermedio": return "text-amber-700";
        case "avanzado": return "text-rose-700";
        default: return "text-blue-700";
    }
}

function nivelBorde(nivel) {
    switch (nivel) {
        case "basico": return "bg-emerald-500";
        case "intermedio": return "bg-amber-500";
        case "avanzado": return "bg-rose-500";
        default: return "bg-blue-500";
    }
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

if (!document.getElementById("progreso-estilos")) {
    const estiloAnimacion = document.createElement("style");
    estiloAnimacion.id = "progreso-estilos";
    estiloAnimacion.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(estiloAnimacion);
}
