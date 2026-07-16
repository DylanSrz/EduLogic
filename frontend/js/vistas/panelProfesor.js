import { requerirRol } from "../api.js";

export function vistaPanelProfesor(app) {
    if (!requerirRol("profesor")) return;

    app.innerHTML = "";
    app.className = "min-h-screen bg-gray-50 flex flex-col";
    
    const contenedor = document.createElement("div");
    contenedor.className = "max-w-7xl mx-auto px-4 py-8 w-full";
    contenedor.innerHTML = `
        <!-- Welcome banner -->
        <div class="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
            <div class="relative z-10">
                <span class="bg-blue-500/30 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Panel del Docente</span>
                <h2 class="text-3xl font-bold mt-2">¡Bienvenido de nuevo, Profesor!</h2>
                <p class="text-blue-100 mt-2 max-w-xl">Aquí puedes gestionar tus cursos, lecciones, calificar cuestionarios y ver el progreso analítico de tus estudiantes.</p>
            </div>
            <!-- Decorative SVG circles -->
            <div class="absolute right-0 top-0 -mt-12 -mr-12 opacity-20" aria-hidden="true">
                <svg class="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" />
                </svg>
            </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Cursos Asignados</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-1">3</h3>
                    </div>
                    <div class="text-3xl bg-blue-50 p-3 rounded-xl">📚</div>
                </div>
                <div class="mt-4 text-xs text-green-600 font-medium flex items-center">
                    <span>Active and running</span>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Estudiantes Activos</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-1">142</h3>
                    </div>
                    <div class="text-3xl bg-indigo-50 p-3 rounded-xl">👨‍🎓</div>
                </div>
                <div class="mt-4 text-xs text-indigo-600 font-medium flex items-center">
                    <span>Across all courses</span>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tareas por Calificar</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-1">12</h3>
                    </div>
                    <div class="text-3xl bg-purple-50 p-3 rounded-xl">📝</div>
                </div>
                <div class="mt-4 text-xs text-red-600 font-medium flex items-center">
                    <span>Requires attention</span>
                </div>
            </div>
        </div>

        <!-- Course management placeholder -->
        <div class="bg-white rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-900">Mis Cursos</h3>
                <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm">
                    + Crear Nuevo Curso
                </button>
            </div>
            
            <div class="divide-y divide-gray-100">
                <div class="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h4 class="font-bold text-gray-800 text-lg">Lógica proposicional</h4>
                        <p class="text-sm text-gray-500 mt-1">Nivel: Básico | 54 Estudiantes inscritos</p>
                    </div>
                    <div class="mt-4 md:mt-0 flex gap-2">
                        <button class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">Ver Detalles</button>
                        <button class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm transition-colors">Administrar</button>
                    </div>
                </div>
                <div class="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h4 class="font-bold text-gray-800 text-lg">Álgebra desde cero</h4>
                        <p class="text-sm text-gray-500 mt-1">Nivel: Básico | 48 Estudiantes inscritos</p>
                    </div>
                    <div class="mt-4 md:mt-0 flex gap-2">
                        <button class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">Ver Detalles</button>
                        <button class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm transition-colors">Administrar</button>
                    </div>
                </div>
                <div class="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h4 class="font-bold text-gray-800 text-lg">Python para principiantes</h4>
                        <p class="text-sm text-gray-500 mt-1">Nivel: Intermedio | 40 Estudiantes inscritos</p>
                    </div>
                    <div class="mt-4 md:mt-0 flex gap-2">
                        <button class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors">Ver Detalles</button>
                        <button class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm transition-colors">Administrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    app.appendChild(contenedor);
}
