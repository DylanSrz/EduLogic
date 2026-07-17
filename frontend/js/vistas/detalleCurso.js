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
        <a href="#/cursos" class="text-blue-600 hover:underline mb-4 inline-block">← Volver al catálogo</a>
        <span class="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-2">${curso.nivel}</span>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">${curso.titulo}</h2>
        <p class="text-lg text-gray-600 mb-8">${curso.descripcion}</p>
        <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-xl font-semibold mb-4">Lecciones</h3>
            <div id="lista-lecciones" class="space-y-3"></div>
        </div>
    `;
       

    app.appendChild(contenedor);

    const listaLecciones = contenedor.querySelector("#lista-lecciones");

    if (Array.isArray(lecciones)) {

        lecciones.sort((a, b) => a.orden - b.orden);

        lecciones.forEach((leccion) => {

            const enlace = document.createElement("a");
            enlace.href = `#/lecciones/${leccion.id}`;
            enlace.className =
                "flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition";

            const numero = document.createElement("span");
            numero.className = "font-bold text-blue-600";
            numero.textContent = `${leccion.orden}.`;

            const titulo = document.createElement("span");
            titulo.className = "text-gray-700";
            titulo.textContent = leccion.titulo;

            enlace.appendChild(numero);
            enlace.appendChild(titulo);

            listaLecciones.appendChild(enlace);

        });

    }
}
