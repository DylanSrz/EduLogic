import { apiGet } from "../api.js";
import { vista404 } from "./noEncontrada.js";

export async function vistaDetalleCurso(app, params) {
    app.innerHTML = "";
    const id = params.id;

    let curso;
    let lecciones;

    try {
        [curso, lecciones] = await Promise.all([
            apiGet(`/cursos/${id}`),
            apiGet(`/cursos/${id}/lecciones`)
        ]);
    } 

    catch (error) {

        if (error.message === "Curso no encontrado.") {
            vista404(app);
            return;
        }

        app.innerHTML = `
            <div class="max-w-3xl mx-auto px-4 py-12">
                <h2 class="text-2xl font-bold text-red-600">
                    Error al cargar el curso
                </h2>

                <p class="mt-2 text-gray-600">
                    ${error.message}
                </p>

                <a
                    href="#/cursos"
                    class="text-blue-600 hover:underline mt-4 inline-block"
                >
                    ← Volver al catálogo
                </a>
            </div>
        `;
        return;
    }

    const contenedor = document.createElement("div");
    contenedor.className ="max-w-5xl mx-auto px-6 py-10";
    contenedor.innerHTML = `
        <a
            href="#/cursos"
            class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8 transition"
        >
            ← Volver al catálogo
        </a>

        <section class="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-10">

            <span class="inline-flex items-center px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-5">
                ${curso.nivel}
            </span>

            <h1 class="text-4xl font-bold text-gray-900 mb-4">
                ${curso.titulo}
            </h1>
            <p class="text-lg leading-9 text-gray-600 max-w-3xl mt-5">  
                ${curso.descripcion}
            </p>

            <div class="flex items-center gap-2 mt-8 text-gray-600 font-medium">
                <span class="text-xl">📚</span>
                <span>${lecciones.length} lecciones disponibles</span>
            </div>

        </section>

        <section>

            <div class="mt-12">
                <h3 class="text-3xl font-bold mb-6">
                    Lecciones del curso
                </h3>

                <div id="lista-lecciones" class="space-y-4"></div>
            </div>

        </section>
    `;
       

    app.appendChild(contenedor);

    const listaLecciones = contenedor.querySelector("#lista-lecciones");

    if (Array.isArray(lecciones)) {

        lecciones.sort((a, b) => a.orden - b.orden);

        lecciones.forEach((leccion) => {

            const enlace = document.createElement("a");
            enlace.href = `#/lecciones/${leccion.id}`;
            enlace.className ="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition";
            const numero = document.createElement("span");
            numero.className = "w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0";
            numero.textContent = `${leccion.orden}.`;

            const titulo = document.createElement("span");
            titulo.className = "text-gray-700";
            titulo.textContent = leccion.titulo;

            enlace.append(numero, titulo);

            listaLecciones.appendChild(enlace);

        });

    }
}
