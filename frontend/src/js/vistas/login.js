export function vistaLogin(app) {
    app.innerHTML = "";
    const contenedor = document.createElement("div");
    contenedor.className = "max-w-md mx-auto px-4 py-12";
    contenedor.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Iniciar sesión</h2>
            <form class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input type="email" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="tu@email.com">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input type="password" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="••••••••">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Entrar
                </button>
            </form>
            <p class="text-center text-sm text-gray-500 mt-4">
                ¿No tienes cuenta? <a href="#/registro" class="text-blue-600 hover:underline">Regístrate</a>
            </p>
        </div>
    `;
    app.appendChild(contenedor);
}