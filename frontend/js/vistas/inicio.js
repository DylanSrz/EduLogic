export function vistaInicio(app) {
    app.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.appendChild(crearHero());
    contenedor.appendChild(crearCaracteristicas());
    contenedor.appendChild(crearCTA());

    app.appendChild(contenedor);

    animarEnOrden(contenedor);
}

function crearHero() {
    const hero = document.createElement("section");
    hero.className = "relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden";

    const patron = document.createElement("div");
    patron.className = "absolute inset-0 opacity-10";
    patron.style.backgroundImage = "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px)";
    patron.style.backgroundSize = "40px 40px";
    hero.appendChild(patron);

    const contenido = document.createElement("div");
    contenido.className = "relative max-w-5xl mx-auto px-4 py-24 md:py-32 text-center";

    contenido.innerHTML = `
        <span class="inline-block bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Plataforma educativa inteligente
        </span>
        <h2 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Bienvenido a <span class="text-blue-200">EduLogic</span>
        </h2>
        <p class="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            La plataforma que fortalece tus habilidades en lógica, matemáticas y programación.
            Aprende a tu ritmo, sin prerrequisitos.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#/cursos" class="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-50 active:scale-95 transition-all shadow-lg">
                Explorar cursos
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
            <a href="#/login" class="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-white/20 active:scale-95 transition-all">
                Iniciar sesión
            </a>
        </div>
    `;

    hero.appendChild(contenido);
    return hero;
}

function crearCaracteristicas() {
    const seccion = document.createElement("section");
    seccion.className = "max-w-6xl mx-auto px-4 py-20 md:py-28";

    seccion.innerHTML = `
        <div class="text-center mb-14">
            <span class="inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">¿Por qué EduLogic?</span>
            <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Aprende de forma inteligente</h3>
            <p class="text-gray-500 text-lg max-w-2xl mx-auto">Todo lo que necesitas para dominar nuevas habilidades, diseñado para que avances a tu propio ritmo.</p>
        </div>
    `;

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 md:grid-cols-3 gap-8";
    grid.id = "caracteristicas-grid";

    const caracteristicas = [
        {
            icono: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
            color: "bg-blue-50 text-blue-600",
            titulo: "Sin prerrequisitos",
            descripcion: "Empieza desde cero con lecciones paso a paso. No necesitas conocimientos previos, solo curiosidad y ganas de aprender."
        },
        {
            icono: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
            color: "bg-amber-50 text-amber-600",
            titulo: "Evaluación inmediata",
            descripcion: "Recibe retroalimentación pedagógica al instante. Cada ejercicio te explica por qué tu respuesta es correcta o incorrecta."
        },
        {
            icono: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>`,
            color: "bg-purple-50 text-purple-600",
            titulo: "Exploración libre",
            descripcion: "Navega cualquier curso en el orden que prefieras. Sin horarios fijos, sin presiones. Tú decides tu camino."
        }
    ];

    caracteristicas.forEach((c, i) => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center";
        card.style.animation = "fadeInUp 0.5s ease-out " + (i * 0.15 + 0.2) + "s both";

        card.innerHTML = `
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl ${c.color} flex items-center justify-center">
                ${c.icono}
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">${c.titulo}</h3>
            <p class="text-gray-500 leading-relaxed">${c.descripcion}</p>
        `;

        grid.appendChild(card);
    });

    seccion.appendChild(grid);
    return seccion;
}

function crearCTA() {
    const cta = document.createElement("section");
    cta.className = "bg-gradient-to-br from-blue-600 to-indigo-700";
    cta.style.animation = "fadeInUp 0.5s ease-out 0.8s both";

    cta.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-20 text-center text-white">
            <h3 class="text-3xl md:text-4xl font-bold mb-4">¿Listo para empezar?</h3>
            <p class="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Únete a EduLogic y transforma tu manera de aprender. Todo el contenido es gratuito y está diseñado para que avances a tu ritmo.
            </p>
            <a href="#/registro" class="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-50 active:scale-95 transition-all shadow-lg">
                Crear cuenta gratis
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
            </a>
        </div>
    `;

    return cta;
}

function animarEnOrden(contenedor) {
    const targets = contenedor.querySelectorAll("[style*='animation']");
    targets.forEach(el => {
        el.style.animation = el.style.animation;
    });
}

if (!document.getElementById("inicio-estilos")) {
    const estilos = document.createElement("style");
    estilos.id = "inicio-estilos";
    estilos.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(estilos);
}
