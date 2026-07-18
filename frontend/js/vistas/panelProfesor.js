import { apiGet, apiPost, apiPut, apiDelete } from "../api.js";
import { escapeHTML } from "../ui.js";

const estado = {
    vista: "cursos",
    curso: null,
    cursos: [],
    lecciones: [],
};

const NIVELES = ["basico", "intermedio", "avanzado"];
const COLORES_NIVEL = {
    basico: { bg: "bg-green-100", text: "text-green-700" },
    intermedio: { bg: "bg-yellow-100", text: "text-yellow-700" },
    avanzado: { bg: "bg-red-100", text: "text-red-700" },
};

let appOut = null;

function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function toast(mensaje, tipo = "exito") {
    const existente = document.querySelector(".toast-notification");
    if (existente) existente.remove();
    const colores = tipo === "exito"
        ? "bg-green-600"
        : tipo === "error"
        ? "bg-red-600"
        : "bg-blue-600";
    const div = document.createElement("div");
    div.className = `toast-notification fixed top-4 right-4 z-50 ${colores} text-white font-bold px-6 py-3 rounded-full border-2 border-gray-900 shadow-ludica-sm transition-all duration-300`;
    div.textContent = mensaje;
    document.body.appendChild(div);
    requestAnimationFrame(() => div.style.opacity = "1");
    setTimeout(() => {
        div.style.opacity = "0";
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

function modal(titulo, contenidoForm, onConfirmar) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4";
    overlay.id = "modal-overlay";
    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl border-2 border-gray-900 shadow-ludica w-full max-w-lg max-h-[90vh] overflow-y-auto";
    const header = document.createElement("div");
    header.className = "flex items-center justify-between p-6 border-b";
    const h = document.createElement("h3");
    h.className = "text-xl font-semibold text-gray-900";
    h.textContent = titulo;
    header.appendChild(h);
    const btnCerrar = document.createElement("button");
    btnCerrar.className = "text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer";
    btnCerrar.textContent = "×";
    btnCerrar.addEventListener("click", () => overlay.remove());
    header.appendChild(btnCerrar);
    card.appendChild(header);
    const body = document.createElement("div");
    body.className = "p-6";
    body.appendChild(contenidoForm);
    card.appendChild(body);
    const footer = document.createElement("div");
    footer.className = "flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl";
    const btnCancelar = document.createElement("button");
    btnCancelar.className = "px-4 py-2 text-gray-700 font-bold bg-white border-2 border-gray-900 rounded-full shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer";
    btnCancelar.textContent = "Cancelar";
    btnCancelar.addEventListener("click", () => overlay.remove());
    footer.appendChild(btnCancelar);
    const btnGuardar = document.createElement("button");
    btnGuardar.className = "px-4 py-2 bg-blue-600 text-white font-bold rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer disabled:opacity-50";
    btnGuardar.textContent = "Guardar";
    btnGuardar.addEventListener("click", async () => {
        btnGuardar.disabled = true;
        btnGuardar.textContent = "Guardando...";
        try {
            await onConfirmar();
            overlay.remove();
            toast("Operación exitosa.");
        } catch (e) {
            toast(e.message, "error");
        } finally {
            btnGuardar.disabled = false;
            btnGuardar.textContent = "Guardar";
        }
    });
    footer.appendChild(btnGuardar);
    card.appendChild(footer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
    });
    return overlay;
}

function confirmar(mensaje, onAceptar) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4";
    overlay.id = "confirm-overlay";
    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl border-2 border-gray-900 shadow-ludica w-full max-w-md";
    const body = document.createElement("div");
    body.className = "p-6 text-center";
    const icono = document.createElement("div");
    icono.className = "text-red-500 text-5xl mb-4";
    icono.textContent = "!";
    body.appendChild(icono);
    const msg = document.createElement("p");
    msg.className = "text-gray-700 mb-6";
    msg.textContent = mensaje;
    body.appendChild(msg);
    card.appendChild(body);
    const footer = document.createElement("div");
    footer.className = "flex justify-center gap-3 p-6 border-t bg-gray-50 rounded-b-xl";
    const btnCancelar = document.createElement("button");
    btnCancelar.className = "px-4 py-2 text-gray-700 font-bold bg-white border-2 border-gray-900 rounded-full shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer";
    btnCancelar.textContent = "Cancelar";
    btnCancelar.addEventListener("click", () => overlay.remove());
    footer.appendChild(btnCancelar);
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", async () => {
        btnEliminar.disabled = true;
        btnEliminar.textContent = "Eliminando...";
        try {
            await onAceptar();
            overlay.remove();
            toast("Eliminado correctamente.");
        } catch (e) {
            toast(e.message, "error");
        } finally {
            btnEliminar.disabled = false;
            btnEliminar.textContent = "Eliminar";
        }
    });
    footer.appendChild(btnEliminar);
    card.appendChild(footer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

function campoFormulario(label, tipo, valor = "", required = true) {
    const grupo = document.createElement("div");
    grupo.className = "mb-4";
    const lbl = document.createElement("label");
    lbl.className = "block text-sm font-medium text-gray-700 mb-1";
    lbl.textContent = label;
    grupo.appendChild(lbl);
    if (tipo === "select") {
        const select = document.createElement("select");
        select.className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";
        if (required) select.required = true;
        grupo.appendChild(select);
        return { grupo, input: select };
    }
    if (tipo === "textarea") {
        const textarea = document.createElement("textarea");
        textarea.className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y min-h-[100px]";
        textarea.value = valor;
        if (required) textarea.required = true;
        grupo.appendChild(textarea);
        return { grupo, input: textarea };
    }
    const input = document.createElement("input");
    input.type = tipo;
    input.className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";
    input.value = valor;
    if (required) input.required = true;
    grupo.appendChild(input);
    return { grupo, input };
}

function leerPayload() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
        return null;
    }
}

/* ------------------------------------------------------------------ */
/*  RENDER PRINCIPAL                                                   */
/* ------------------------------------------------------------------ */
async function render() {
    if (!appOut) return;

    const wrapper = document.createElement("div");
    wrapper.className = "min-h-full bg-gray-50";

    const main = document.createElement("main");
    wrapper.appendChild(main);
    appOut.innerHTML = "";
    appOut.appendChild(wrapper);

    const cont = document.createElement("div");
    cont.className = "max-w-6xl mx-auto px-8 py-8";
    main.appendChild(cont);

    try {
        if (estado.vista === "cursos") {
            await renderCursos(cont);
        } else if (estado.vista === "constructor" && estado.curso) {
            await renderConstructor(cont);
        }
    } catch (e) {
        cont.innerHTML = `
            <div class="text-center py-16">
                <div class="text-red-500 text-5xl mb-4">!</div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Error al cargar datos</h3>
                <p class="text-gray-500 mb-6" id="error-msg"></p>
                <button id="btn-retry" class="bg-blue-600 text-white font-bold px-6 py-2 rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer">Reintentar</button>
            </div>
        `;
        cont.querySelector("#error-msg").textContent = e.message;
        cont.querySelector("#btn-retry")?.addEventListener("click", render);
    }
}

/* ------------------------------------------------------------------ */
/*  VISTA: LISTA DE CURSOS                                             */
/* ------------------------------------------------------------------ */
async function renderCursos(cont) {
    estado.cursos = await apiGet("/cursos");

    cont.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Mis Cursos</h1>
                <p class="text-gray-500 text-sm mt-1">Gestiona el contenido de tus cursos.</p>
            </div>
            <button id="btn-nuevo-curso" class="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Nuevo curso
            </button>
        </div>
    `;
    cont.querySelector("#btn-nuevo-curso").addEventListener("click", () => mostrarFormCurso());

    const payload = leerPayload();
    const userId = payload ? parseInt(payload.sub) : null;
    const userRole = payload ? payload.rol : null;

    const grid = document.createElement("div");
    grid.className = "grid md:grid-cols-2 lg:grid-cols-3 gap-6";

    const propios = estado.cursos.filter(c => userRole === "admin" || c.creador_id === userId);

    if (propios.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-16">
            <p class="text-gray-500 text-lg mb-2">Aún no tienes cursos creados.</p>
            <p class="text-gray-400 text-sm">Crea tu primer curso para empezar.</p>
        </div>`;
    } else {
        propios.forEach(curso => {
            const colores = COLORES_NIVEL[curso.nivel] || COLORES_NIVEL.basico;
            const card = document.createElement("div");
            card.className = "bg-white rounded-2xl border-2 border-gray-900 shadow-ludica hover:translate-x-1 hover:translate-y-1 hover:shadow-ludica-sm transition-all duration-200 p-6 flex flex-col";
            card.innerHTML = `
                <span class="inline-block ${colores.bg} ${colores.text} text-xs font-semibold px-3 py-1 rounded-full mb-3 self-start">${escapeHTML(capitalizar(curso.nivel))}</span>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${escapeHTML(curso.titulo)}</h3>
                <p class="text-gray-500 text-sm mb-4 flex-1">${escapeHTML(curso.descripcion || "Sin descripción.")}</p>
                <div class="flex flex-wrap gap-2 mt-auto pt-4 border-t">
                    <button class="btn-constructor flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">Construir</button>
                    <button class="btn-editar bg-gray-100 text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">Editar</button>
                    <button class="btn-eliminar bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">Eliminar</button>
                </div>
            `;
            card.querySelector(".btn-constructor").addEventListener("click", () => {
                estado.curso = curso;
                estado.vista = "constructor";
                render();
            });
            card.querySelector(".btn-editar").addEventListener("click", () => mostrarFormCurso(curso));
            card.querySelector(".btn-eliminar").addEventListener("click", () => {
                confirmar(
                    `¿Eliminar "${curso.titulo}"? También se borrarán todas sus lecciones y cuestionarios.`,
                    async () => {
                        await apiDelete(`/cursos/${curso.id}`);
                        render();
                    }
                );
            });
            grid.appendChild(card);
        });
    }
    cont.appendChild(grid);
}

function mostrarFormCurso(cursoExistente = null) {
    const esEdicion = !!cursoExistente;
    const form = document.createElement("div");
    const titulo = campoFormulario("Título del curso", "text", cursoExistente?.titulo || "");
    form.appendChild(titulo.grupo);
    const desc = campoFormulario("Descripción", "textarea", cursoExistente?.descripcion || "");
    form.appendChild(desc.grupo);
    const nivel = campoFormulario("Nivel", "select");
    NIVELES.forEach(n => {
        const opt = document.createElement("option");
        opt.value = n;
        opt.textContent = capitalizar(n);
        if (cursoExistente?.nivel === n) opt.selected = true;
        nivel.input.appendChild(opt);
    });
    form.appendChild(nivel.grupo);
    modal(
        esEdicion ? "Editar curso" : "Nuevo curso",
        form,
        async () => {
            const tituloVal = titulo.input.value.trim();
            if (!tituloVal || tituloVal.length < 3) throw new Error("El título debe tener al menos 3 caracteres.");
            const datos = { titulo: tituloVal, nivel: nivel.input.value };
            const descVal = desc.input.value.trim();
            if (descVal) datos.descripcion = descVal;
            if (esEdicion) {
                await apiPut(`/cursos/${cursoExistente.id}`, datos);
            } else {
                await apiPost("/cursos", datos);
            }
            render();
        }
    );
}

/* ------------------------------------------------------------------ */
/*  VISTA: CONSTRUCTOR DEL CURSO                                       */
/* ------------------------------------------------------------------ */
async function renderConstructor(cont) {
    const curso = estado.curso;
    estado.lecciones = await apiGet(`/cursos/${curso.id}/lecciones`);
    const totalLecciones = estado.lecciones.length;

    cont.innerHTML = `
        <div class="text-sm text-gray-400 mb-6">
            <span class="hover:text-gray-600 transition-colors cursor-pointer breadcrumb-cursos">Mis Cursos</span>
            <span class="mx-2">/</span>
            <span class="text-gray-600 font-medium">${escapeHTML(curso.titulo)}</span>
        </div>

        <div class="flex items-start justify-between mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">${escapeHTML(curso.titulo)}</h1>
                <p class="text-gray-500 text-sm mt-1">Construye el contenido del curso: lecciones y sus cuestionarios.</p>
            </div>
            <div class="bg-white rounded-xl border-2 border-gray-900 shadow-ludica-sm px-5 py-3 shrink-0 text-center">
                <div class="text-2xl font-bold text-gray-900">${totalLecciones}</div>
                <div class="text-gray-400 text-xs">${totalLecciones === 1 ? "lección" : "lecciones"}</div>
            </div>
        </div>

        <div class="space-y-4" id="lecciones-container"></div>
    `;

    cont.querySelector(".breadcrumb-cursos")?.addEventListener("click", () => {
        estado.vista = "cursos";
        estado.curso = null;
        estado.lecciones = [];
        render();
    });

    const container = cont.querySelector("#lecciones-container");

    estado.lecciones
        .slice()
        .sort((a, b) => a.orden - b.orden)
        .forEach((lec, idx) => {
            const bloque = document.createElement("div");
            bloque.dataset.expandido = idx === 0 ? "true" : "false";

            const preview = lec.contenido
                ? lec.contenido.substring(0, 120) + (lec.contenido.length > 120 ? "..." : "")
                : "Sin contenido.";

            bloque.innerHTML = `
                <div class="bg-white rounded-2xl border-2 border-gray-900 shadow-ludica overflow-hidden">
                    <div class="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
                        <div class="flex items-center gap-3 cursor-pointer toggle-leccion flex-1 min-w-0">
                            <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md shrink-0">Lección ${idx + 1}</span>
                            <h3 class="font-semibold text-gray-900 truncate">${escapeHTML(lec.titulo)}</h3>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <button class="btn-edit-lec text-gray-400 hover:text-blue-600 transition-colors p-1 cursor-pointer" title="Editar lección">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                            <button class="btn-del-lec text-gray-400 hover:text-red-600 transition-colors p-1 cursor-pointer" title="Eliminar lección">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                            <svg class="w-5 h-5 text-gray-400 transition-transform toggle-icon ${idx === 0 ? "rotate-180" : ""} toggle-leccion cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                    </div>
                    <div class="contenido-leccion ${idx === 0 ? "" : "hidden"}">
                        <div class="px-5 pb-5 space-y-3">
                            <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 preview-contenido"></div>

                            <div class="border-t border-gray-100 pt-3 mt-1">
                                <button class="btn-toggle-quiz text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1.5 cursor-pointer transition-colors w-full text-left">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    Cuestionario
                                    <svg class="w-4 h-4 ml-auto toggle-quiz-icon text-gray-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                                </button>
                                <div class="contenido-quiz hidden mt-3 space-y-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // preview con textContent: es contenido de la lección escrito por el usuario
            bloque.querySelector(".preview-contenido").textContent = preview;

            const contenidoLeccion = bloque.querySelector(".contenido-leccion");
            let quizCargado = false;

            bloque.querySelectorAll(".toggle-leccion").forEach(t => {
                t.addEventListener("click", () => {
                    const icono = bloque.querySelector(".toggle-icon");
                    const expandido = bloque.dataset.expandido === "true";
                    bloque.dataset.expandido = !expandido;
                    contenidoLeccion.classList.toggle("hidden", expandido);
                    icono.classList.toggle("rotate-180", !expandido);
                });
            });

            bloque.querySelector(".btn-toggle-quiz").addEventListener("click", (e) => {
                e.stopPropagation();
                const quizSection = bloque.querySelector(".contenido-quiz");
                const quizIcon = bloque.querySelector(".toggle-quiz-icon");
                const oculto = quizSection.classList.toggle("hidden");
                quizIcon.classList.toggle("rotate-180", !oculto);
                if (!oculto && !quizCargado) {
                    quizCargado = true;
                    cargarCuestionario(lec, quizSection);
                }
            });

            bloque.querySelector(".btn-edit-lec")?.addEventListener("click", (e) => {
                e.stopPropagation();
                mostrarFormLeccion(lec);
            });

            bloque.querySelector(".btn-del-lec")?.addEventListener("click", (e) => {
                e.stopPropagation();
                confirmar(
                    `¿Eliminar la lección "${lec.titulo}"? Si tiene cuestionario, también se eliminará.`,
                    async () => {
                        await apiDelete(`/lecciones/${lec.id}`);
                        render();
                    }
                );
            });

            container.appendChild(bloque);
        });

    const btnNuevaLeccion = document.createElement("button");
    btnNuevaLeccion.className = "w-full border-2 border-dashed border-gray-200 rounded-xl py-8 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer flex items-center justify-center gap-2";
    btnNuevaLeccion.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Nueva lección
    `;
    // el orden sugerido es el siguiente al ultimo existente
    const siguienteOrden = totalLecciones > 0
        ? Math.max(...estado.lecciones.map(l => l.orden)) + 1
        : 1;
    btnNuevaLeccion.addEventListener("click", () => mostrarFormLeccion(null, siguienteOrden));
    container.appendChild(btnNuevaLeccion);
}

function mostrarFormLeccion(leccionExistente = null, ordenSugerido = null) {
    const esEdicion = !!leccionExistente;
    const form = document.createElement("div");
    const titulo = campoFormulario("Título de la lección", "text", leccionExistente?.titulo || "");
    form.appendChild(titulo.grupo);
    const contenido = campoFormulario("Contenido", "textarea", leccionExistente?.contenido || "");
    form.appendChild(contenido.grupo);
    const ordenVal = leccionExistente?.orden?.toString() || (ordenSugerido?.toString() || "1");
    const orden = campoFormulario("Orden", "number", ordenVal);
    orden.input.min = "1";
    form.appendChild(orden.grupo);
    modal(
        esEdicion ? "Editar lección" : "Nueva lección",
        form,
        async () => {
            const datos = {
                titulo: titulo.input.value.trim(),
                contenido: contenido.input.value.trim(),
                orden: parseInt(orden.input.value),
            };
            if (!datos.titulo || datos.titulo.length < 3) throw new Error("El título debe tener al menos 3 caracteres.");
            if (!datos.contenido) throw new Error("El contenido no puede estar vacío.");
            if (isNaN(datos.orden) || datos.orden < 1) throw new Error("El orden debe ser un número positivo.");
            if (esEdicion) {
                await apiPut(`/lecciones/${leccionExistente.id}`, datos);
            } else {
                await apiPost(`/cursos/${estado.curso.id}/lecciones`, datos);
            }
            render();
        }
    );
}

/* ------------------------------------------------------------------ */
/*  CUESTIONARIO Y PREGUNTAS                                          */
/* ------------------------------------------------------------------ */
async function cargarCuestionario(leccion, container) {
    container.innerHTML = `<div class="text-center py-4 text-gray-400 text-sm">Cargando cuestionario...</div>`;

    try {
        // El endpoint devuelve el cuestionario de la leccion por el id de la LECCION.
        // Si la leccion no tiene cuestionario, responde 404 y caemos al catch.
        const cuestionario = await apiGet(`/lecciones/${leccion.id}/cuestionario`);
        renderCuestionario(leccion, cuestionario, container);
        return;
    } catch {
        // sin cuestionario todavia: ofrecer crearlo
    }

    container.innerHTML = `
        <div class="text-center py-6 bg-purple-50/50 rounded-xl">
            <p class="text-gray-500 text-sm mb-3">Esta lección no tiene cuestionario.</p>
            <button class="btn-crear-quiz bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer">
                + Crear cuestionario
            </button>
        </div>
    `;
    container.querySelector(".btn-crear-quiz").addEventListener("click", () => mostrarFormCrearCuestionario(leccion, container));
}

function mostrarFormCrearCuestionario(leccion, container) {
    const form = document.createElement("div");
    form.className = "space-y-3";
    form.innerHTML = `
        <input id="quiz-titulo" type="text" placeholder="Título del cuestionario" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm">
        <div class="flex gap-2">
            <button class="btn-cancel-quiz flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">Cancelar</button>
            <button class="btn-save-quiz flex-1 px-3 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">Guardar</button>
        </div>
    `;
    container.innerHTML = "";
    container.appendChild(form);

    form.querySelector(".btn-cancel-quiz").addEventListener("click", () => cargarCuestionario(leccion, container));
    form.querySelector(".btn-save-quiz").addEventListener("click", async () => {
        const titulo = form.querySelector("#quiz-titulo").value.trim();
        if (!titulo || titulo.length < 3) { toast("El título debe tener al menos 3 caracteres.", "error"); return; }
        try {
            const cuestionario = await apiPost(`/lecciones/${leccion.id}/cuestionarios`, { titulo });
            renderCuestionario(leccion, cuestionario, container);
            toast("Cuestionario creado.");
        } catch (e) {
            toast(e.message, "error");
        }
    });
}

function renderCuestionario(leccion, cuestionario, container) {
    const tienePreguntas = cuestionario.preguntas && cuestionario.preguntas.length > 0;

    container.innerHTML = `
        <div class="flex items-center justify-between bg-purple-50/50 rounded-xl p-3">
            <div class="flex items-center gap-2 min-w-0">
                <svg class="w-4 h-4 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span class="text-sm font-medium text-gray-900 truncate">${escapeHTML(cuestionario.titulo)}</span>
            </div>
            <button class="btn-del-quiz text-red-500 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer shrink-0">Eliminar</button>
        </div>
        <div class="flex items-center justify-between">
            <span class="text-xs text-gray-400">${tienePreguntas ? cuestionario.preguntas.length + " pregunta(s)" : "Sin preguntas"}</span>
            <button class="btn-nueva-preg text-purple-600 hover:text-purple-700 text-xs font-medium cursor-pointer">+ Nueva pregunta</button>
        </div>
    `;

    container.querySelector(".btn-del-quiz").addEventListener("click", () => {
        confirmar(
            `¿Eliminar el cuestionario "${cuestionario.titulo}" y todas sus preguntas?`,
            async () => {
                await apiDelete(`/cuestionarios/${cuestionario.id}`);
                container.innerHTML = "";
                cargarCuestionario(leccion, container);
                toast("Cuestionario eliminado.");
            }
        );
    });

    container.querySelector(".btn-nueva-preg").addEventListener("click", () => {
        mostrarFormPregunta(cuestionario, null, container, leccion);
    });

    if (tienePreguntas) {
        const lista = document.createElement("div");
        lista.className = "space-y-2";

        cuestionario.preguntas.forEach((preg, idx) => {
            const correctas = preg.opciones ? preg.opciones.filter(o => o.es_correcta).length : 0;
            const totalOpc = preg.opciones ? preg.opciones.length : 0;
            const card = document.createElement("div");
            card.className = "bg-white border border-gray-100 rounded-lg p-3";
            card.innerHTML = `
                <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900">${idx + 1}. ${escapeHTML(preg.enunciado)}</div>
                        <div class="text-xs text-gray-400 mt-1">${correctas} correcta(s) · ${totalOpc} opciones</div>
                    </div>
                    <div class="flex gap-1 shrink-0">
                        <button class="btn-edit-preg text-gray-400 hover:text-blue-600 text-xs p-1 cursor-pointer" title="Editar">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button class="btn-del-preg text-gray-400 hover:text-red-600 text-xs p-1 cursor-pointer" title="Eliminar">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </div>
            `;

            card.querySelector(".btn-edit-preg").addEventListener("click", () => {
                mostrarFormPregunta(cuestionario, preg, container, leccion);
            });
            card.querySelector(".btn-del-preg").addEventListener("click", () => {
                confirmar(`¿Eliminar esta pregunta?`, async () => {
                    await apiDelete(`/preguntas/${preg.id}`);
                    const r = await apiGet(`/lecciones/${leccion.id}/cuestionario`);
                    renderCuestionario(leccion, r, container);
                    toast("Pregunta eliminada.");
                });
            });

            lista.appendChild(card);
        });

        container.appendChild(lista);
    }
}

function mostrarFormPregunta(cuestionario, preguntaExistente, container, leccion) {
    const esEdicion = !!preguntaExistente;
    const form = document.createElement("div");
    form.className = "bg-white border border-gray-100 rounded-xl p-4 space-y-3";

    const previas = preguntaExistente?.opciones || [
        { texto: "", es_correcta: true },
        { texto: "", es_correcta: false },
    ];

    form.innerHTML = `
        <textarea id="preg-enunciado" placeholder="Enunciado de la pregunta" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm resize-y min-h-[60px]"></textarea>
        <textarea id="preg-explicacion" placeholder="Explicación pedagógica (se muestra al fallar)" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm resize-y min-h-[60px]"></textarea>
        <div>
            <label class="text-xs font-medium text-gray-500 mb-1 block">Opciones <span class="text-gray-400">(marca la correcta)</span></label>
            <div class="space-y-2" id="opciones-container"></div>
            <button id="btn-agregar-op" class="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Agregar opción
            </button>
        </div>
        <div class="flex gap-2 pt-1">
            <button class="btn-cancel-preg flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">Cancelar</button>
            <button class="btn-save-preg flex-1 px-3 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">${esEdicion ? "Guardar cambios" : "Crear pregunta"}</button>
        </div>
    `;

    // Valores con .value (no interpolados en el HTML): datos de la API tratados como texto plano
    form.querySelector("#preg-enunciado").value = preguntaExistente?.enunciado || "";
    form.querySelector("#preg-explicacion").value = preguntaExistente?.explicacion || "";

    const opcionesContainer = form.querySelector("#opciones-container");

    function agregarFilaOpcion(texto = "", correcta = false) {
        const idx = opcionesContainer.querySelectorAll(".opcion-row").length;
        const row = document.createElement("div");
        row.className = "flex items-center gap-2 opcion-row";
        row.innerHTML = `
            <input type="radio" name="quiz-correcta" value="${idx}" ${correcta ? "checked" : ""} class="cursor-pointer shrink-0">
            <input type="text" placeholder="Opción ${idx + 1}" class="opcion-input flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm">
            <button class="btn-quitar-op text-red-400 hover:text-red-600 p-1 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        `;
        row.querySelector(".opcion-input").value = texto;  // texto de la API como valor plano
        row.querySelector(".btn-quitar-op").addEventListener("click", () => {
            row.remove();
            actualizarRadios(form);
            actualizarBotonesQuitar(form);
        });
        opcionesContainer.appendChild(row);
    }

    previas.forEach(op => agregarFilaOpcion(op.texto, op.es_correcta));
    actualizarBotonesQuitar(form);

    form.querySelector("#btn-agregar-op").addEventListener("click", () => {
        agregarFilaOpcion();
        actualizarRadios(form);
        actualizarBotonesQuitar(form);
    });

    form.querySelector(".btn-cancel-preg").addEventListener("click", async () => {
        const r = await apiGet(`/lecciones/${leccion.id}/cuestionario`);
        renderCuestionario(leccion, r, container);
    });

    form.querySelector(".btn-save-preg").addEventListener("click", async () => {
        const enunciado = form.querySelector("#preg-enunciado").value.trim();
        const explicacion = form.querySelector("#preg-explicacion").value.trim();
        if (!enunciado || enunciado.length < 10) { toast("El enunciado debe tener al menos 10 caracteres.", "error"); return; }
        if (!explicacion) { toast("La explicación pedagógica es obligatoria.", "error"); return; }

        const rows = form.querySelectorAll(".opcion-row");
        let correctaIdx = -1;
        const opciones = [];
        rows.forEach((row, i) => {
            const radio = row.querySelector("input[type=radio]");
            const input = row.querySelector(".opcion-input");
            if (radio.checked) correctaIdx = i;
            opciones.push({ texto: input.value.trim(), es_correcta: radio.checked });
        });

        if (correctaIdx === -1) { toast("Debes marcar una opción como correcta.", "error"); return; }
        if (opciones.some(o => !o.texto)) { toast("Todas las opciones deben tener texto.", "error"); return; }
        if (opciones.length < 2) { toast("Debe haber al menos 2 opciones.", "error"); return; }

        const datos = { enunciado, explicacion, opciones };

        try {
            if (esEdicion) {
                await apiPut(`/preguntas/${preguntaExistente.id}`, datos);
            } else {
                await apiPost(`/cuestionarios/${cuestionario.id}/preguntas`, datos);
            }
            const r = await apiGet(`/lecciones/${leccion.id}/cuestionario`);
            renderCuestionario(leccion, r, container);
            toast(esEdicion ? "Pregunta actualizada." : "Pregunta creada.");
        } catch (e) {
            toast(e.message, "error");
        }
    });

    container.innerHTML = "";
    container.appendChild(form);
}

function actualizarRadios(form) {
    const rows = form.querySelectorAll(".opcion-row");
    const checked = form.querySelector("input[type=radio]:checked");
    rows.forEach((row, i) => {
        const radio = row.querySelector("input[type=radio]");
        radio.value = i.toString();
        radio.name = "quiz-correcta";
    });
    if (checked) checked.checked = true;
}

function actualizarBotonesQuitar(form) {
    const rows = form.querySelectorAll(".opcion-row");
    rows.forEach(row => {
        const btn = row.querySelector(".btn-quitar-op");
        if (btn) btn.classList.toggle("hidden", rows.length <= 2);
    });
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                            */
/* ------------------------------------------------------------------ */
export function vistaPanelProfesor(app) {
    appOut = app;
    estado.vista = "cursos";
    estado.curso = null;
    estado.lecciones = [];
    render();
}
