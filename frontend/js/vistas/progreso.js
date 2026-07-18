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

function mostrarLoading(app) {

    const contenedor = document.createElement("div");
    contenedor.className = "max-w-6xl mx-auto px-6 py-10";

    contenedor.innerHTML = `
        <div class="h-10 w-56 bg-gray-200 rounded animate-pulse mb-8"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            ${Array.from({ length: 3 }, () => `
                <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100 animate-pulse">
                    <div class="h-4 bg-gray-200 rounded w-28 mb-4"></div>
                    <div class="h-8 bg-gray-200 rounded w-16"></div>
                </div>
            `).join("")}
        </div>

        <div class="space-y-6">
            ${Array.from({ length: 3 }, () => `
                <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <div class="h-7 bg-gray-200 rounded w-48 mb-3"></div>
                            <div class="h-6 bg-gray-200 rounded-full w-24"></div>
                        </div>
                        <div class="h-7 bg-gray-200 rounded w-14"></div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 mb-5"></div>
                    <div class="flex items-center justify-between">
                        <div class="h-5 bg-gray-200 rounded w-40"></div>
                        <div class="h-9 bg-blue-200 rounded-lg w-28"></div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;

    app.appendChild(contenedor);
}

function mostrarError(app, error) {

    app.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.className = "max-w-3xl mx-auto py-24 text-center px-4";

    contenedor.innerHTML = `
        <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
            <svg class="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
        </div>

        <h2 class="text-2xl font-bold text-gray-800 mb-2">
            Error al cargar el progreso
        </h2>

        <p class="text-gray-500 mb-8 max-w-md mx-auto">
            ${escapeHTML(error.message)}
        </p>

        <button
            id="btn-reintentar"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all cursor-pointer font-medium"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Reintentar
        </button>
    `;

    app.appendChild(contenedor);

    contenedor.querySelector("#btn-reintentar").addEventListener("click", () => {
        vistaProgreso(app);
    });
}

function renderizar(app, progreso) {

    app.innerHTML = "";

    if (progreso.length === 0) {
        app.innerHTML = `
            <div class="max-w-2xl mx-auto py-20 text-center">

                <div class="text-7xl mb-6">
                    📈
                </div>

                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    Aún no tienes progreso
                </h1>

                <p class="text-gray-600 text-lg mb-8">
                    Empieza un curso y aquí podrás seguir tu avance.
                </p>

                <a
                    href="#/cursos"
                    class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                    Explorar cursos
                </a>

            </div>
        `;

        return;
    }

    const cursosActivos = progreso.length;

    const leccionesCompletadas = progreso.reduce(
        (total, curso) => total + curso.lecciones_completadas,
        0
    );

    const progresoPromedio = Math.round(
        progreso.reduce((total, curso) => total + curso.porcentaje, 0) /
        cursosActivos
    );

    const contenedor = document.createElement("div");
    contenedor.className = "max-w-6xl mx-auto px-6 py-10";

    contenedor.innerHTML = `
        <div class="mb-10">
            <h1 class="text-4xl font-bold text-gray-900">
                Mi progreso
            </h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

                <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <p class="text-gray-500 text-sm">Cursos activos</p>
                    <h2 class="text-3xl font-bold text-blue-600 mt-2">
                        ${cursosActivos}
                    </h2>
                </div>

                <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <p class="text-gray-500 text-sm">Lecciones completadas</p>
                    <h2 class="text-3xl font-bold text-green-600 mt-2">
                        ${leccionesCompletadas}
                    </h2>
                </div>

                <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <p class="text-gray-500 text-sm">Progreso promedio</p>
                    <h2 class="text-3xl font-bold text-purple-600 mt-2">
                        ${progresoPromedio}%
                    </h2>
                </div>

            </div>

            <p class="text-gray-600 mt-2">
                Sigue tu avance en los cursos que has comenzado.
            </p>
        </div>

        <div id="lista-progreso" class="space-y-6"></div>
    `;

    app.appendChild(contenedor);

    const listaProgreso = contenedor.querySelector("#lista-progreso");

    progreso.forEach((curso) => {

        const tarjeta = document.createElement("div");

        tarjeta.className =
            "bg-white rounded-2xl shadow-md border border-gray-100 p-6";

        tarjeta.innerHTML = `
            <div class="flex items-center justify-between mb-4">

                <div>

                    <h2 class="text-2xl font-bold text-gray-900">
                        ${escapeHTML(curso.titulo)}
                    </h2>

                    <span class="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                        ${escapeHTML(curso.nivel)}
                    </span>

                </div>

                <span class="text-2xl font-bold text-blue-600">
                    ${curso.porcentaje}%
                </span>

            </div>

            <div class="w-full bg-gray-200 rounded-full h-3 mb-5">

                <div
                    class="bg-blue-600 h-3 rounded-full"
                    style="width: ${curso.porcentaje}%"
                ></div>

            </div>

            <div class="flex items-center justify-between">

                <p class="text-gray-600">
                    ${curso.lecciones_completadas} de ${curso.total_lecciones} lecciones
                </p>

                <a
                    href="#/cursos/${curso.curso_id}"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                >
                    Continuar
                </a>

            </div>
        `;

        listaProgreso.appendChild(tarjeta);

    });

}
