export function vista404(app) {
    app.innerHTML = "";
    const contenedor = document.createElement("div");
    contenedor.className = "flex flex-col items-center justify-center min-h-[60vh] text-center px-4";
    contenedor.innerHTML = `
        <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Página no encontrada</h2>
        <p class="text-gray-500 mb-6">La ruta que buscas no existe.</p>
        <a href="#/" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Volver al inicio
        </a>
    `;
    app.appendChild(contenedor);
}