export function vistaInicio(app) {
    app.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.appendChild(crearHero());
    contenedor.appendChild(crearCinta());
    contenedor.appendChild(crearCaracteristicas());
    contenedor.appendChild(crearCTA());

    app.appendChild(contenedor);

    animarEnOrden(contenedor);
}

function crearHero() {
    const hero = document.createElement("section");
    hero.className = "relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800 text-white overflow-hidden";

    // Formas flotantes y símbolos STEM de fondo: dan el tono lúdico del hero
    const formas = document.createElement("div");
    formas.className = "pointer-events-none absolute inset-0 select-none";
    formas.innerHTML = `
        <div class="absolute top-14 left-[7%] w-16 h-16 rounded-2xl bg-white/10 rotate-12" style="animation: flotar 7s ease-in-out infinite;"></div>
        <div class="absolute top-1/3 right-[9%] w-24 h-24 rounded-full border-4 border-white/15" style="animation: flotar 9s ease-in-out infinite 1s;"></div>
        <div class="absolute bottom-16 left-[16%] w-10 h-10 rounded-full bg-amber-300/60" style="animation: flotar 6s ease-in-out infinite 0.5s;"></div>
        <div class="absolute bottom-24 right-[20%] w-14 h-14 rounded-2xl bg-purple-400/40 -rotate-12" style="animation: flotar 8s ease-in-out infinite 1.5s;"></div>
        <span class="absolute top-24 right-[28%] font-display text-6xl text-white/10">∑</span>
        <span class="absolute bottom-32 left-[30%] font-display text-5xl text-white/10">π</span>
        <span class="absolute top-1/2 left-[6%] font-display text-4xl text-white/10">&lt;/&gt;</span>
        <span class="absolute top-16 left-[42%] font-display text-5xl text-white/10">?</span>
        <span class="absolute top-[22%] right-[5%] hidden xl:inline-block bg-amber-300 text-gray-900 font-display font-bold text-sm px-4 py-2 rounded-2xl border-2 border-gray-900 shadow-ludica-sm rotate-6" style="animation: flotar 6s ease-in-out infinite;">
            100% gratis ✨
        </span>
        <span class="absolute bottom-[14%] left-[6%] hidden xl:inline-block bg-purple-400 text-white font-display font-bold text-sm px-4 py-2 rounded-2xl border-2 border-gray-900 shadow-ludica-sm -rotate-6" style="animation: flotar 7s ease-in-out infinite 1s;">
            Sin prerrequisitos 🚀
        </span>
    `;
    hero.appendChild(formas);

    const contenido = document.createElement("div");
    contenido.className = "relative max-w-5xl mx-auto px-4 py-24 md:py-32 text-center";

    contenido.innerHTML = `
        <span class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold text-sm px-4 py-1.5 rounded-full mb-6 ring-1 ring-white/25">
            ⚡ Aprende STEM desde cero
        </span>
        <h2 class="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-[1.05]">
            Aprender lógica también<br class="hidden md:block">
            puede ser <span class="relative inline-block text-amber-300">un juego<svg class="absolute -bottom-2 left-0 w-full text-purple-400" viewBox="0 0 200 12" fill="none" aria-hidden="true"><path d="M3 9c50-9 100-9 194-3" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg></span>
        </h2>
        <p class="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Fortalece tus habilidades en lógica, matemáticas y programación con
            lecciones cortas y quizzes que te explican cada error. A tu ritmo, sin prerrequisitos.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#/cursos" class="inline-flex items-center justify-center gap-2 bg-amber-300 text-gray-900 px-8 py-3.5 rounded-full text-lg font-bold border-2 border-gray-900 shadow-ludica hover:translate-x-1 hover:translate-y-1 hover:shadow-ludica-sm active:shadow-none transition-all">
                Explorar cursos
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
            <a href="#/login" class="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white ring-2 ring-white/40 px-8 py-3.5 rounded-full text-lg font-bold hover:bg-white hover:text-blue-700 active:scale-95 transition-all">
                Iniciar sesión
            </a>
        </div>
    `;

    hero.appendChild(contenido);
    return hero;
}

// Cinta marquesina estilo feria: temas de la plataforma en bucle infinito.
// El contenido va dos veces para que el salto de -50% empalme sin cortes.
function crearCinta() {
    const cinta = document.createElement("div");
    cinta.className = "bg-gray-900 text-amber-300 overflow-hidden py-3 border-y-4 border-gray-900 select-none";

    const secuencia = "LÓGICA&nbsp;&nbsp;✦&nbsp;&nbsp;MATEMÁTICAS&nbsp;&nbsp;✦&nbsp;&nbsp;PROGRAMACIÓN&nbsp;&nbsp;✦&nbsp;&nbsp;RETOS&nbsp;&nbsp;✦&nbsp;&nbsp;QUIZZES&nbsp;&nbsp;✦&nbsp;&nbsp;";
    cinta.innerHTML = `
        <div class="flex whitespace-nowrap font-display text-lg font-bold tracking-widest" style="width: max-content; animation: marquesina 24s linear infinite;">
            <span>${secuencia}</span>
            <span aria-hidden="true">${secuencia}</span>
        </div>
    `;

    return cinta;
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
            color: "bg-blue-100 text-blue-700",
            titulo: "Sin prerrequisitos",
            descripcion: "Empieza desde cero con lecciones paso a paso. No necesitas conocimientos previos, solo curiosidad y ganas de aprender."
        },
        {
            icono: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
            color: "bg-amber-100 text-amber-600",
            titulo: "Evaluación inmediata",
            descripcion: "Recibe retroalimentación pedagógica al instante. Cada ejercicio te explica por qué tu respuesta es correcta o incorrecta."
        },
        {
            icono: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>`,
            color: "bg-purple-100 text-purple-600",
            titulo: "Exploración libre",
            descripcion: "Navega cualquier curso en el orden que prefieras. Sin horarios fijos, sin presiones. Tú decides tu camino."
        }
    ];

    caracteristicas.forEach((c, i) => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-3xl border-2 border-gray-900 shadow-ludica hover:translate-x-1 hover:translate-y-1 hover:shadow-ludica-sm transition-all duration-200 p-8 text-center";
        card.style.animation = "fadeInUp 0.5s ease-out " + (i * 0.15 + 0.2) + "s both";

        card.innerHTML = `
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl ${c.color} border-2 border-gray-900 flex items-center justify-center -rotate-6">
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
    cta.className = "relative bg-gradient-to-br from-amber-300 to-amber-400 overflow-hidden";
    cta.style.animation = "fadeInUp 0.5s ease-out 0.8s both";

    cta.innerHTML = `
        <div class="pointer-events-none absolute inset-0 select-none">
            <div class="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/20"></div>
            <div class="absolute -bottom-10 right-[12%] w-24 h-24 rounded-3xl bg-purple-500/15 rotate-12"></div>
            <span class="absolute top-8 right-[6%] font-display text-6xl text-gray-900/10">!</span>
        </div>
        <div class="relative max-w-4xl mx-auto px-4 py-20 text-center text-gray-900">
            <h3 class="font-display text-3xl md:text-4xl font-bold mb-4">¿Listo para empezar?</h3>
            <p class="text-gray-800/80 text-lg mb-8 max-w-2xl mx-auto">
                Únete a EduLogic y transforma tu manera de aprender. Todo el contenido es gratuito y está diseñado para que avances a tu ritmo.
            </p>
            <a href="#/registro" class="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-full text-lg font-bold border-2 border-gray-900 shadow-[6px_6px_0_0_rgba(255,255,255,0.7)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0_0_rgba(255,255,255,0.7)] active:shadow-none transition-all">
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
