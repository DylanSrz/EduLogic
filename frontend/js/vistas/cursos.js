export function vistaCursos(app) {
    app.innerHTML = "";
    const contenedor = document.createElement("div");
    contenedor.className = "max-w-4xl mx-auto px-4 py-12";
    const cursos = [
        { id: 1, titulo: "Lógica proposicional", nivel: "Básico", descripcion: "Fundamentos del razonamiento lógico formal." },
        { id: 2, titulo: "Álgebra desde cero", nivel: "Básico", descripcion: "Operaciones, ecuaciones y expresiones algebraicas." },
        { id: 3, titulo: "Python para principiantes", nivel: "Intermedio", descripcion: "Tu primer lenguaje de programación." },
    ];

    contenedor.innerHTML = `
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Catálogo de cursos</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="lista-cursos"></div>
    `;
    app.appendChild(contenedor);

    const lista = document.getElementById("lista-cursos");
    cursos.forEach(curso => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow";
        tarjeta.innerHTML = `
            <span class="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">${curso.nivel}</span>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">${curso.titulo}</h3>
            <p class="text-gray-500 mb-4">${curso.descripcion}</p>
            <a href="#/cursos/${curso.id}" class="text-blue-600 font-medium hover:underline">
                Ver curso →
            </a>
        `;
        lista.appendChild(tarjeta);
    });
}