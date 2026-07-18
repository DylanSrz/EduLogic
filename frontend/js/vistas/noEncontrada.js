export function vista404(app) {
    app.innerHTML = "";
    const contenedor = document.createElement("div");
    contenedor.className = "flex flex-col items-center justify-center min-h-[60vh] text-center px-4";
    contenedor.innerHTML = `
        <div class="relative mb-4 select-none">
            <h1 class="font-display text-[7rem] leading-none font-bold text-blue-200">404</h1>
            <span class="absolute inset-0 flex items-center justify-center text-5xl" style="animation: flotar 5s ease-in-out infinite;">🧭</span>
        </div>
        <h2 class="font-display text-2xl font-bold text-gray-800 mb-2">¡Ups! Esta página se nos perdió</h2>
        <p class="text-gray-500 mb-6">La ruta que buscas no existe o cambió de lugar.</p>
        <a href="#/" class="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:scale-95 transition-all">
            Volver al inicio
        </a>
    `;
    app.appendChild(contenedor);
}