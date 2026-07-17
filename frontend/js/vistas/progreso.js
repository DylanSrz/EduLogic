import { apiGet } from "../api.js";

export async function vistaProgreso(app) {

    app.innerHTML = "";
    let progreso;

    try {
        progreso = await apiGet("/progreso/resumen");
    } 
    
    catch (error) {
        app.innerHTML = `
            <div class="max-w-3xl mx-auto py-12">
                <h2 class="text-2xl font-bold text-red-600">
                    Error al cargar el progreso
                </h2>

                <p class="mt-2 text-gray-600">
                    ${error.message}
                </p>
            </div>
        `;

        return;
    }

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
                        ${curso.titulo}
                    </h2>

                    <span class="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                        ${curso.nivel}
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
