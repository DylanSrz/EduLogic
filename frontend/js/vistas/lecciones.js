import { apiGet } from "../api.js";
import { vista404 } from "./noEncontrada.js";

export async function vistaLeccion(app, parametros) {
    app.innerHTML = "";

    const id = parametros.id;

    let leccion;
    try {
        leccion = await apiGet(`/lecciones/${id}`);
    }
    catch (error) {

        if (error.message === "Lección no encontrada.") {
            vista404(app);
            return;
        }

        app.innerHTML = `
            <div class="max-w-3xl mx-auto py-12">
                <h2 class="text-2xl font-bold text-red-600">
                    No fue posible cargar la lección
                </h2>

                <p class="mt-2 text-gray-600">
                    ${error.message}
                </p>

                <a
                    href="#/cursos"
                    class="text-blue-600 hover:underline mt-4 inline-block"
                >
                    ← Volver
                </a>
            </div>
        `;

        return;
    }
    
    const contenedor = document.createElement("div");
contenedor.className ="max-w-5xl mx-auto px-4 py-12";  
contenedor.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <a
                href="#/cursos/${leccion.curso_id}"
                class="text-blue-600 hover:underline inline-block mb-8"
            >
                ← Volver al curso
            </a>

            <h1 class="text-4xl font-bold text-gray-900 mb-8">
                ${leccion.titulo}
            </h1>

            <article class="bg-white rounded-xl shadow-md p-8">
                <p class="text-gray-700 leading-8 text-lg whitespace-pre-line">
                    ${leccion.contenido}
                </p>
            </article>
        </div>
    `;
    app.appendChild(contenedor);
}
