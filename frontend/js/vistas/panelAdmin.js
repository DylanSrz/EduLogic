import { requerirRol } from "../api.js";

export function vistaPanelAdmin(app) {
    if (!requerirRol("admin")) return;

    app.innerHTML = "";
    app.className = "min-h-screen bg-gray-50 flex flex-col";
    
    const contenedor = document.createElement("div");
    contenedor.className = "max-w-7xl mx-auto px-4 py-8 w-full";
    contenedor.innerHTML = `
        <!-- Welcome banner -->
        <div class="bg-gradient-to-r from-red-700 to-rose-800 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
            <div class="relative z-10">
                <span class="bg-red-500/30 text-rose-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Panel de Administración</span>
                <h2 class="text-3xl font-bold mt-2">¡Consola de Administración de EduLogic!</h2>
                <p class="text-rose-100 mt-2 max-w-xl">Supervisa el rendimiento global, gestiona usuarios, edita roles y configura los parámetros principales de la plataforma.</p>
            </div>
            <!-- Decorative background pattern -->
            <div class="absolute right-0 top-0 -mt-12 -mr-12 opacity-10" aria-hidden="true">
                <svg class="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 200 200">
                    <rect x="20" y="20" width="160" height="160" rx="20" />
                </svg>
            </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Estudiantes</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-1">2,450</h3>
                    </div>
                    <div class="text-3xl bg-red-50 p-3 rounded-xl">👨‍🎓</div>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-rose-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Profesores</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-1">45</h3>
                    </div>
                    <div class="text-3xl bg-rose-50 p-3 rounded-xl">👨‍🏫</div>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Cursos Publicados</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-1">18</h3>
                    </div>
                    <div class="text-3xl bg-orange-50 p-3 rounded-xl">📚</div>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Reportes del Sistema</p>
                        <h3 class="text-3xl font-bold text-gray-800 mt-1">0</h3>
                    </div>
                    <div class="text-3xl bg-amber-50 p-3 rounded-xl">🛡️</div>
                </div>
            </div>
        </div>

        <!-- Administrative tasks -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                <h3 class="text-xl font-bold text-gray-900 mb-6">Usuarios Recientes</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3">Nombre</th>
                                <th scope="col" class="px-6 py-3">Email</th>
                                <th scope="col" class="px-6 py-3">Rol</th>
                                <th scope="col" class="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr class="bg-white">
                                <td class="px-6 py-4 font-medium text-gray-900">Juan Pérez</td>
                                <td class="px-6 py-4">juan.perez@example.com</td>
                                <td class="px-6 py-4"><span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">Estudiante</span></td>
                                <td class="px-6 py-4"><button class="text-blue-600 hover:underline font-semibold">Editar</button></td>
                            </tr>
                            <tr class="bg-white">
                                <td class="px-6 py-4 font-medium text-gray-900">Dr. Harold Aristizábal</td>
                                <td class="px-6 py-4">harold@edulogic.edu</td>
                                <td class="px-6 py-4"><span class="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full">Profesor</span></td>
                                <td class="px-6 py-4"><button class="text-blue-600 hover:underline font-semibold">Editar</button></td>
                            </tr>
                            <tr class="bg-white">
                                <td class="px-6 py-4 font-medium text-gray-900">Dylan Suárez</td>
                                <td class="px-6 py-4">dylan@edulogic.edu</td>
                                <td class="px-6 py-4"><span class="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full">Admin</span></td>
                                <td class="px-6 py-4"><button class="text-blue-600 hover:underline font-semibold">Editar</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-md p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
                <div class="space-y-4">
                    <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors text-left flex items-center justify-between">
                        <span>Gestionar Categorías</span>
                        <span>🏷️</span>
                    </button>
                    <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors text-left flex items-center justify-between">
                        <span>Configurar API</span>
                        <span>⚙️</span>
                    </button>
                    <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors text-left flex items-center justify-between">
                        <span>Ver Logs del Sistema</span>
                        <span>📋</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    app.appendChild(contenedor);
}
