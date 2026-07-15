export function vistaDetalleCurso(app, params) {
    app.innerHTML = "";
    const id = params.id;
    const cursosSimulados = {
        1: { titulo: "Lógica proposicional", nivel: "Básico", descripcion: "Aprende las bases del razonamiento lógico: proposiciones, conectores, tablas de verdad y más." },
        2: { titulo: "Álgebra desde cero", nivel: "Básico", descripcion: "Domina los fundamentos del álgebra: variables, ecuaciones lineales y factorización." },
        3: { titulo: "Python para principiantes", nivel: "Intermedio", descripcion: "Escribe tus primeras líneas de código con el lenguaje más popular del mundo." },
    };

    const curso = cursosSimulados[id];

    const contenedor = document.createElement("div");
    contenedor.className = "max-w-3xl mx-auto px-4 py-12";

    if (curso) {
        contenedor.innerHTML = `
            <a href="#/cursos" class="text-blue-600 hover:underline mb-4 inline-block">← Volver al catálogo</a>
            <span class="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-2">${curso.nivel}</span>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">${curso.titulo}</h2>
            <p class="text-lg text-gray-600 mb-8">${curso.descripcion}</p>
            <div class="bg-white rounded-xl shadow-md p-6">
                <h3 class="text-xl font-semibold mb-4">Lecciones</h3>
                <ul class="space-y-3">
                    <li class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span class="text-blue-600 font-bold">1.</span>
                        <span class="text-gray-700">Introducción</span>
                    </li>
                    <li class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span class="text-blue-600 font-bold">2.</span>
                        <span class="text-gray-700">Conceptos fundamentales</span>
                    </li>
                    <li class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span class="text-blue-600 font-bold">3.</span>
                        <span class="text-gray-700">Ejercicios prácticos</span>
                    </li>
                </ul>
            </div>
        `;
    } else {
        contenedor.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-700">Curso no encontrado</h2>
            <p class="text-gray-500 mt-2">El curso con ID ${id} no existe.</p>
            <a href="#/cursos" class="text-blue-600 hover:underline mt-4 inline-block">← Volver al catálogo</a>
        `;
    }

    app.appendChild(contenedor);
}