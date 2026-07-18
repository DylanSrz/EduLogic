import { apiGet, apiPost } from "../api.js";
import { escapeHTML } from "../ui.js";
import { rolActual } from "../sesion.js";

export async function vistaCuestionario(app, { id }) {
    app.innerHTML = "";

    // Solo los estudiantes presentan cuestionarios (CP-22): profesores y
    // admins crean y supervisan. El motor igual respondería 403 al enviar —
    // esto evita que lleguen hasta alla. La sesion ya la garantiza el router.
    if (rolActual() !== "estudiante") {
        const aviso = document.createElement("div");
        aviso.className = "max-w-3xl mx-auto px-4 py-16 text-center";
        aviso.innerHTML = `
            <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <svg class="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Los cuestionarios los presentan los estudiantes</h3>
            <p class="text-gray-500 mb-8 max-w-md mx-auto">Tu rol crea y supervisa el contenido. Para editar este cuestionario, usa el panel del profesor.</p>
            <a href="#/panel-profesor" class="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium">
                Ir al panel del profesor
            </a>
        `;
        app.appendChild(aviso);
        return;
    }

    if (!document.getElementById("cuestionario-estilos")) {
        const s = document.createElement("style");
        s.id = "cuestionario-estilos";
        s.textContent = `
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(s);
    }

    const estado = {
        respuestas: {},
        cuestionario: null,
        preguntaActual: 0,
        enviando: false,
    };

    const contenedor = document.createElement("div");
    contenedor.className = "max-w-3xl mx-auto px-4 py-8";
    app.appendChild(contenedor);
    mostrarLoading(contenedor);

    try {
        const cuestionario = await apiGet(`/cuestionarios/${id}`);
        estado.cuestionario = cuestionario;

        if (!cuestionario.preguntas || cuestionario.preguntas.length === 0) {
            mostrarSinPreguntas(contenedor);
            return;
        }

        renderizarFaseRespuesta(contenedor, estado);
    } catch (error) {
        mostrarError(contenedor, error.message, () => vistaCuestionario(app, { id }));
    }
}

function mostrarLoading(container) {
    container.innerHTML = `
        <div class="animate-pulse space-y-6">
            <div class="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div class="h-2 bg-gray-200 rounded-full w-full"></div>
            <div class="h-64 bg-gray-200 rounded-2xl"></div>
            <div class="flex justify-between">
                <div class="h-10 bg-gray-200 rounded-xl w-24"></div>
                <div class="h-10 bg-gray-200 rounded-xl w-32"></div>
            </div>
        </div>
    `;
}

function mostrarError(container, mensaje, reintentar) {
    container.innerHTML = `
        <div class="text-center py-16">
            <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <svg class="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Error al cargar el cuestionario</h3>
            <p class="text-gray-500 mb-8 max-w-md mx-auto">${escapeHTML(mensaje)}</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button class="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all cursor-pointer font-medium btn-reintentar-carga">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Reintentar
                </button>
                <a href="#/cursos" class="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all font-medium">
                    Volver a cursos
                </a>
            </div>
        </div>
    `;

    const btn = container.querySelector(".btn-reintentar-carga");
    if (btn) btn.addEventListener("click", reintentar);
}

function mostrarSinPreguntas(container) {
    container.innerHTML = `
        <div class="text-center py-16">
            <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                <svg class="w-12 h-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Este cuestionario no tiene preguntas</h3>
            <p class="text-gray-500 mb-8">Parece que el profesor aún no ha agregado preguntas a este cuestionario.</p>
            <a href="#/cursos" class="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium">
                Volver a cursos
            </a>
        </div>
    `;
}

// ---------------------------------------------------------------------------
// Fase 1 — Responder preguntas
// ---------------------------------------------------------------------------

function renderizarFaseRespuesta(container, estado) {
    const c = estado.cuestionario;

    container.innerHTML = `
        <div class="mb-8">
            <a href="#/cursos" class="text-blue-600 hover:underline text-sm inline-flex items-center gap-1 mb-4">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Volver a cursos
            </a>
            <div class="flex items-center gap-3 mb-2">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Cuestionario
                </span>
            </div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">${escapeHTML(c.titulo)}</h2>
        </div>

        <div id="progreso-container" class="mb-8"></div>

        <div id="pregunta-container" class="mb-8"></div>

        <div id="nav-container"></div>

        <div id="error-envio" class="hidden mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"></div>
    `;

    refrescarPregunta(container, estado);
}

function htmlProgreso(estado) {
    const total = estado.cuestionario.preguntas.length;
    const respondidas = Object.keys(estado.respuestas).length;
    const actual = estado.preguntaActual;
    const porcentaje = Math.round(((actual + 1) / total) * 100);

    const dots = estado.cuestionario.preguntas.map((p, i) => {
        let cls = "w-2.5 h-2.5 rounded-full transition-all duration-300 ";
        if (i === actual) cls += "bg-blue-600 ring-2 ring-blue-200 scale-125";
        else if (estado.respuestas[p.id]) cls += "bg-blue-400";
        else cls += "bg-gray-300";
        return `<div class="${cls}"></div>`;
    }).join("");

    return `
        <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Pregunta ${actual + 1} de ${total}</span>
            <span class="text-sm text-gray-500">${respondidas} de ${total} respondidas</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${porcentaje}%"></div>
        </div>
        <div class="flex justify-center gap-2 mt-3">${dots}</div>
    `;
}

function htmlPregunta(estado) {
    const pregunta = estado.cuestionario.preguntas[estado.preguntaActual];
    const seleccionada = estado.respuestas[pregunta.id];

    const opciones = pregunta.opciones.map(o => {
        const sel = seleccionada === o.id;
        return `
            <div class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${sel ? "border-gray-900 bg-blue-50 shadow-ludica-sm" : "border-gray-300 hover:border-gray-900 hover:bg-blue-50"}"
                 data-pregunta-id="${pregunta.id}" data-opcion-id="${o.id}" data-opcion>
                <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${sel ? "border-blue-500" : "border-gray-300"}">
                    ${sel ? '<div class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>' : ''}
                </div>
                <span class="text-gray-700 leading-relaxed ${sel ? "text-blue-700 font-medium" : ""}">${escapeHTML(o.texto)}</span>
            </div>
        `;
    }).join("");

    return `
        <div class="bg-white rounded-2xl border-2 border-gray-900 shadow-ludica p-6 md:p-8" style="animation: fadeInUp 0.3s ease-out both;">
            <div class="flex items-center gap-3 mb-5">
                <span class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">${estado.preguntaActual + 1}</span>
                <h3 class="text-lg md:text-xl font-semibold text-gray-900 leading-relaxed">${escapeHTML(pregunta.enunciado)}</h3>
            </div>
            <div class="space-y-3" id="opciones-container">${opciones}</div>
        </div>
    `;
}

function htmlNavegacion(estado) {
    const total = estado.cuestionario.preguntas.length;
    const esPrimera = estado.preguntaActual === 0;
    const esUltima = estado.preguntaActual === total - 1;
    const todasRespondidas = Object.keys(estado.respuestas).length === total;

    const anterior = esPrimera ? "" : `
        <button class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-gray-900 bg-white text-gray-700 font-bold shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-95 transition-all cursor-pointer btn-anterior">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
            Anterior
        </button>
    `;

    const siguiente = esUltima
        ? `<button class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all cursor-pointer btn-enviar ${todasRespondidas ? "bg-blue-600 text-white border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-95" : "bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed"}" ${todasRespondidas ? "" : "disabled"}>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Enviar respuestas
            </button>`
        : `<button class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-95 transition-all cursor-pointer btn-siguiente">
                Siguiente
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
            </button>`;

    return `
        <div class="flex items-center justify-between gap-3" style="animation: fadeInUp 0.3s ease-out 0.15s both;">
            ${anterior || '<div></div>'}
            ${siguiente}
        </div>
        ${esUltima && !todasRespondidas ? '<p class="text-center text-sm text-gray-400 mt-3">Responde todas las preguntas para poder enviar</p>' : ''}
    `;
}

function refrescarPregunta(container, estado) {
    const pC = container.querySelector("#progreso-container");
    const qC = container.querySelector("#pregunta-container");
    const nC = container.querySelector("#nav-container");
    if (pC) pC.innerHTML = htmlProgreso(estado);
    if (qC) { qC.innerHTML = htmlPregunta(estado); bindOpciones(container, estado); }
    if (nC) { nC.innerHTML = htmlNavegacion(estado); bindNavegacion(container, estado); }
}

function actualizarProgreso(container, estado) {
    const pC = container.querySelector("#progreso-container");
    const nC = container.querySelector("#nav-container");
    if (pC) pC.innerHTML = htmlProgreso(estado);
    if (nC) { nC.innerHTML = htmlNavegacion(estado); bindNavegacion(container, estado); }
}

function bindOpciones(container, estado) {
    const opciones = container.querySelector("#opciones-container");
    if (!opciones) return;

    opciones.querySelectorAll("[data-opcion]").forEach(el => {
        el.addEventListener("click", () => {
            if (estado.enviando) return;

            const preguntaId = parseInt(el.dataset.preguntaId);
            const opcionId = parseInt(el.dataset.opcionId);

            estado.respuestas[preguntaId] = opcionId;

            const todas = opciones.querySelectorAll(`[data-pregunta-id="${preguntaId}"]`);
            todas.forEach(o => {
                o.className = "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all border-gray-300 hover:border-gray-900 hover:bg-blue-50";
                const dot = o.querySelector("div:first-child");
                if (dot) { dot.className = "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all border-gray-300"; dot.innerHTML = ""; }
                const txt = o.querySelector("span");
                if (txt) txt.className = "text-gray-700 leading-relaxed";
            });

            el.className = "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all border-gray-900 bg-blue-50 shadow-ludica-sm";
            const dot = el.querySelector("div:first-child");
            if (dot) { dot.className = "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all border-blue-500"; dot.innerHTML = '<div class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>'; }
            const txt = el.querySelector("span");
            if (txt) txt.className = "text-blue-700 font-medium leading-relaxed";

            actualizarProgreso(container, estado);
        });
    });
}

function bindNavegacion(container, estado) {
    container.querySelector(".btn-siguiente")?.addEventListener("click", () => {
        if (estado.enviando) return;
        estado.preguntaActual++;
        refrescarPregunta(container, estado);
    });

    container.querySelector(".btn-anterior")?.addEventListener("click", () => {
        if (estado.enviando) return;
        estado.preguntaActual--;
        refrescarPregunta(container, estado);
    });

    container.querySelector(".btn-enviar")?.addEventListener("click", () => {
        manejarEnvio(container, estado);
    });
}

async function manejarEnvio(container, estado) {
    const btn = container.querySelector(".btn-enviar");
    if (!btn || btn.disabled || estado.enviando) return;

    estado.enviando = true;
    btn.disabled = true;
    btn.className = "inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold bg-blue-400 text-white border-2 border-gray-900 cursor-wait";
    btn.innerHTML = `
        <svg class="w-4 h-4 animate-spin" style="animation: spin 1s linear infinite;" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Calificando...
    `;

    const errorDiv = container.querySelector("#error-envio");
    if (errorDiv) errorDiv.classList.add("hidden");

    try {
        const body = {
            respuestas: Object.entries(estado.respuestas).map(([pid, oid]) => ({
                pregunta_id: parseInt(pid),
                opcion_id: oid,
            })),
        };

        const resultado = await apiPost(`/cuestionarios/${estado.cuestionario.id}/intentos`, body);
        renderizarFaseResultados(container, estado, resultado);
    } catch (error) {
        estado.enviando = false;

        if (errorDiv) {
            errorDiv.classList.remove("hidden");
            errorDiv.innerHTML = `
                <div class="flex items-start gap-2">
                    <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                        <p class="font-medium">Error al enviar las respuestas</p>
                        <p>${escapeHTML(error.message)}</p>
                    </div>
                </div>
            `;
        }

        btn.disabled = false;
        btn.className = "inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold bg-blue-600 text-white border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-95 transition-all cursor-pointer btn-enviar";
        btn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Enviar respuestas
        `;
    }
}

// ---------------------------------------------------------------------------
// Fase 2 — Resultados
// ---------------------------------------------------------------------------

function renderizarFaseResultados(container, estado, resultado) {
    const { puntaje, total_preguntas, correctas, retroalimentacion } = resultado;
    const msg = mensajeSegunPuntaje(puntaje);
    const c = colorSegunPuntaje(puntaje);

    container.innerHTML = `
        <div class="text-center mb-10" style="animation: fadeInUp 0.4s ease-out both;">
            <div class="w-32 h-32 mx-auto mb-5 rounded-full flex items-center justify-center ${c.fondo} border-4 border-gray-900 shadow-ludica">
                <span class="font-display text-3xl font-bold ${c.texto}">${puntaje}%</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">${msg}</h2>
            <p class="text-gray-500 text-lg">Acertaste ${correctas} de ${total_preguntas} pregunta${total_preguntas !== 1 ? "s" : ""}</p>
        </div>

        <div class="space-y-4 mb-8">
            ${retroalimentacion.map((p, i) => `
                <div class="bg-white rounded-2xl border-2 border-gray-900 shadow-ludica-sm p-6" style="animation: fadeInUp 0.3s ease-out ${i * 0.1 + 0.3}s both;">
                    <div class="flex items-start gap-3 mb-3">
                        <span class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${p.fue_correcta ? "bg-green-100" : "bg-red-100"}">
                            ${p.fue_correcta ? svgCheck() : svgX()}
                        </span>
                        <h3 class="font-semibold text-gray-900 leading-relaxed pt-0.5">${escapeHTML(p.enunciado)}</h3>
                    </div>
                    <div class="ml-10 space-y-1.5 text-sm">
                        <p class="text-gray-600">
                            Tu respuesta:
                            <span class="${p.fue_correcta ? "text-green-600 font-medium" : "text-red-600 line-through"}">${escapeHTML(p.opcion_elegida)}</span>
                        </p>
                        ${!p.fue_correcta ? `<p class="text-green-700 font-medium">Respuesta correcta: ${escapeHTML(p.opcion_correcta)}</p>` : ""}
                    </div>
                    ${!p.fue_correcta ? `
                        <div class="ml-10 mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
                            <p class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">¿Por qué?</p>
                            <p class="text-sm text-blue-900 leading-relaxed">${escapeHTML(p.explicacion)}</p>
                        </div>
                    ` : ""}
                </div>
            `).join("")}
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center" style="animation: fadeInUp 0.3s ease-out 0.6s both;">
            <button class="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-95 transition-all cursor-pointer font-bold btn-reintentar">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Reintentar cuestionario
            </button>
            <a href="#/lecciones/${estado.cuestionario.leccion_id}" class="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-900 px-6 py-2.5 rounded-full shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Volver a la lección
            </a>
            <a href="#/mi-progreso" class="inline-flex items-center justify-center gap-2 bg-amber-300 text-gray-900 border-2 border-gray-900 px-6 py-2.5 rounded-full shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Ver mi progreso
            </a>
        </div>
    `;

    const btn = container.querySelector(".btn-reintentar");
    if (btn) {
        // No se navega: asignar el mismo hash no dispara hashchange y la vista
        // no se re-renderizaria. Se reinicia el estado y se vuelve a la fase
        // de respuesta (el cuestionario ya esta cargado en memoria).
        btn.addEventListener("click", () => {
            estado.respuestas = {};
            estado.preguntaActual = 0;
            estado.enviando = false;
            renderizarFaseRespuesta(container, estado);
        });
    }
}

function mensajeSegunPuntaje(puntaje) {
    if (puntaje >= 80) return "¡Excelente!";
    if (puntaje >= 50) return "¡Buen intento, revisa los errores!";
    return "Repasa la lección y vuelve a intentarlo";
}

function colorSegunPuntaje(puntaje) {
    if (puntaje >= 80) return { texto: "text-green-600", fondo: "bg-green-100", anillo: "ring-green-300" };
    if (puntaje >= 50) return { texto: "text-amber-600", fondo: "bg-amber-100", anillo: "ring-amber-300" };
    return { texto: "text-red-600", fondo: "bg-red-100", anillo: "ring-red-300" };
}

function svgCheck() {
    return '<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>';
}

function svgX() {
    return '<svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>';
}
