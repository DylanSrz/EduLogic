export function vistaCuestionario(app, parametros) {
    app.innerHTML = "";
    const contenedor = document.createElement("div");
    contenedor.className = "flex flex-col items-center justify-center min-h-[60vh] text-center px-4";
    contenedor.innerHTML = `
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Cuestionario</h1>
        <p class="text-gray-500 mb-6">Cuestionario ID: ${parametros.id}</p>
        <p class="text-gray-400">Contenido próximamente.</p>
    `;
    app.appendChild(contenedor);
}
