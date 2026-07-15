export function vistaInicio(app) {
    app.innerHTML = "";
    const contenedor = document.createElement("div");
    contenedor.className = "max-w-4xl mx-auto px-4 py-12";
    contenedor.innerHTML = `
        <section class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">Bienvenido a EduLogic</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                La plataforma que fortalece tus habilidades en lógica, matemáticas y programación.
                Aprende a tu ritmo, sin prerrequisitos.
            </p>
            <div class="mt-8 flex justify-center gap-4">
                <a href="#/cursos" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
                    Explorar cursos
                </a>
                <a href="#/login" class="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors">
                    Iniciar sesión
                </a>
            </div>
        </section>
        <section class="grid md:grid-cols-3 gap-8">
            <div class="bg-white rounded-xl shadow-md p-6 text-center">
                <div class="text-4xl mb-3">📘</div>
                <h3 class="text-lg font-semibold mb-2">Sin prerrequisitos</h3>
                <p class="text-gray-500">Empieza desde cero con lecciones paso a paso.</p>
            </div>
            <div class="bg-white rounded-xl shadow-md p-6 text-center">
                <div class="text-4xl mb-3">⚡</div>
                <h3 class="text-lg font-semibold mb-2">Evaluación inmediata</h3>
                <p class="text-gray-500">Recibe retroalimentación pedagógica al instante.</p>
            </div>
            <div class="bg-white rounded-xl shadow-md p-6 text-center">
                <div class="text-4xl mb-3">🗺️</div>
                <h3 class="text-lg font-semibold mb-2">Exploración libre</h3>
                <p class="text-gray-500">Navega cualquier curso en el orden que prefieras.</p>
            </div>
        </section>
    `;
    app.appendChild(contenedor);
}