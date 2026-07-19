import { apiGet, apiPost } from "../api.js";
import { escapeHTML } from "../ui.js";
import { haySesion, rolActual } from "../sesion.js";
import { vista404 } from "./noEncontrada.js";

export async function vistaLeccion(app, parametros) {
    app.innerHTML = "";

    const id = parametros.id;

    let leccion;
    try {
        leccion = await apiGet(`/lecciones/${id}`);
    }
    catch (error) {

        if (error.message === "Lección no encontrada.") {
            vista404(app);
            return;
        }

        const cont = document.createElement("div");
        cont.className = "max-w-3xl mx-auto py-12";
        cont.innerHTML = `
            <h2 class="text-2xl font-bold text-red-600">
                No fue posible cargar la lección
            </h2>

            <p class="mt-2 text-gray-600" id="leccion-error"></p>

            <a
                href="#/cursos"
                class="text-blue-600 hover:underline mt-4 inline-block"
            >
                ← Volver
            </a>
        `;
        cont.querySelector("#leccion-error").textContent = error.message;
        app.appendChild(cont);
        return;
    }

    const esEstudiante = haySesion() && rolActual() === "estudiante";

    // Cargas complementarias en paralelo (ninguna es bloqueante si falla):
    // - lecciones hermanas: para el boton "Siguiente leccion"
    // - progreso del curso: para saber si esta leccion ya fue completada
    // - cuestionario de la leccion: para el boton "Presentar cuestionario"
    //   (404 si la leccion no tiene quiz — se ignora)
    const [hermanas, progreso, cuestionario] = await Promise.all([
        apiGet(`/cursos/${leccion.curso_id}/lecciones`).catch(() => []),
        esEstudiante
            ? apiGet(`/progreso/cursos/${leccion.curso_id}`).catch(() => null)
            : Promise.resolve(null),
        haySesion()
            ? apiGet(`/lecciones/${id}/cuestionario`).catch(() => null)
            : Promise.resolve(null),
    ]);

    const yaCompletada = !!(
        progreso &&
        progreso.lecciones.some(l => l.leccion_id === leccion.id && l.completada)
    );

    const siguiente = hermanas
        .filter(l => l.orden > leccion.orden)
        .sort((a, b) => a.orden - b.orden)[0] || null;

    const contenedor = document.createElement("div");
    contenedor.className = "max-w-5xl mx-auto px-4 py-12";
    contenedor.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <a
                href="#/cursos/${leccion.curso_id}"
                class="text-blue-600 hover:underline inline-block mb-8"
            >
                ← Volver al curso
            </a>

            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                ${escapeHTML(leccion.titulo)}
            </h1>

            <article class="bg-white rounded-2xl border-2 border-gray-900 shadow-ludica p-8">
                <p class="text-gray-700 leading-8 text-lg whitespace-pre-line" id="leccion-contenido"></p>
            </article>

            <div class="flex flex-col sm:flex-row items-center gap-4 mt-8" id="acciones-leccion"></div>
        </div>
    `;

    // El contenido lo escribio un profesor: entra como texto plano, jamas como HTML
    contenedor.querySelector("#leccion-contenido").textContent = leccion.contenido;

    app.appendChild(contenedor);

    const acciones = contenedor.querySelector("#acciones-leccion");

    // Regla de negocio: si la leccion tiene cuestionario, completarla exige
    // haberlo aprobado al 100% (mejor puntaje). El dato ya viene en el
    // progreso del curso. Sin datos de progreso se muestra el boton igual:
    // el backend valida la regla de todas formas (la interfaz es UX).
    const puntajes = progreso ? progreso.cuestionarios : null;
    const aproboCuestionario =
        !cuestionario ||
        !puntajes ||
        puntajes.some(c => c.leccion_id === leccion.id && c.mejor_puntaje === 100);

    // Boton "Marcar como completada" — solo estudiantes (el backend igual lo exige)
    if (esEstudiante) {
        if (!yaCompletada && !aproboCuestionario) {
            const aviso = document.createElement("span");
            aviso.textContent = "🔒 Aprueba el cuestionario al 100% para completar la lección";
            aviso.className = "bg-amber-100 text-amber-800 font-bold text-sm px-5 py-3 rounded-full border-2 border-amber-400 text-center";
            acciones.appendChild(aviso);
        } else {
            const btnCompletar = document.createElement("button");
            if (yaCompletada) {
                btnCompletar.textContent = "✔️ Lección completada";
                btnCompletar.className = "bg-green-100 text-green-700 font-bold px-6 py-3 rounded-full border-2 border-green-600 cursor-default";
                btnCompletar.disabled = true;
            } else {
                btnCompletar.textContent = "Marcar como completada";
                btnCompletar.className = "bg-green-600 text-white font-bold px-6 py-3 rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer";
                btnCompletar.addEventListener("click", async () => {
                    btnCompletar.disabled = true;
                    btnCompletar.textContent = "Guardando...";
                    try {
                        const r = await apiPost(`/lecciones/${leccion.id}/completar`);
                        btnCompletar.textContent = `✔️ Completada — avance del curso: ${r.porcentaje}%`;
                        btnCompletar.className = "bg-green-100 text-green-700 font-bold px-6 py-3 rounded-full border-2 border-green-600 cursor-default";
                    } catch (e) {
                        btnCompletar.disabled = false;
                        btnCompletar.textContent = "Marcar como completada";
                        alert(e.message);
                    }
                });
            }
            acciones.appendChild(btnCompletar);
        }
    }

    // Boton "Presentar cuestionario" — si la leccion tiene quiz.
    // OJO: el enlace lleva el id del CUESTIONARIO (no el de la leccion).
    if (cuestionario) {
        const btnQuiz = document.createElement("a");
        btnQuiz.href = `#/cuestionarios/${cuestionario.id}`;
        btnQuiz.textContent = "🧩 Presentar cuestionario";
        btnQuiz.className = "bg-purple-500 text-white font-bold px-6 py-3 rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all";
        acciones.appendChild(btnQuiz);
    }

    // Navegacion a la siguiente leccion en el orden del curso
    if (siguiente && haySesion()) {
        const btnSiguiente = document.createElement("a");
        btnSiguiente.href = `#/lecciones/${siguiente.id}`;
        btnSiguiente.textContent = "Siguiente lección →";
        btnSiguiente.className = "sm:ml-auto text-blue-600 hover:text-blue-700 font-bold px-4 py-3";
        acciones.appendChild(btnSiguiente);
    }
}
