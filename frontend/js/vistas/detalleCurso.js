import { apiGet } from "../api.js";
import { escapeHTML } from "../ui.js";
import { haySesion, rolActual } from "../sesion.js";
import { vista404 } from "./noEncontrada.js";

export async function vistaDetalleCurso(app, params) {
    app.innerHTML = "";
    const id = params.id;

    let curso;
    let lecciones;

    try {
        [curso, lecciones] = await Promise.all([
            apiGet(`/cursos/${id}`),
            apiGet(`/cursos/${id}/lecciones`)
        ]);
    }

    catch (error) {

        if (error.message === "Curso no encontrado.") {
            vista404(app);
            return;
        }

        const cont = document.createElement("div");
        cont.className = "max-w-3xl mx-auto px-4 py-12";
        cont.innerHTML = `
            <h2 class="text-2xl font-bold text-red-600">
                Error al cargar el curso
            </h2>

            <p class="mt-2 text-gray-600" id="detalle-error"></p>

            <a
                href="#/cursos"
                class="text-blue-600 hover:underline mt-4 inline-block"
            >
                ← Volver al catálogo
            </a>
        `;
        cont.querySelector("#detalle-error").textContent = error.message;
        app.appendChild(cont);
        return;
    }

    // Progreso: solo aplica para estudiantes con sesión. Si la consulta falla,
    // la vista funciona igual sin la barra (el progreso es un extra, no un bloqueo).
    const esEstudiante = haySesion() && rolActual() === "estudiante";
    let progreso = null;
    if (esEstudiante) {
        try {
            progreso = await apiGet(`/progreso/cursos/${id}`);
        } catch {
            progreso = null;
        }
    }
    const completadas = new Set(
        (progreso ? progreso.lecciones : [])
            .filter(l => l.completada)
            .map(l => l.leccion_id)
    );

    const sinSesion = !haySesion();

    const contenedor = document.createElement("div");
    contenedor.className = "max-w-5xl mx-auto px-6 py-10";
    contenedor.innerHTML = `
        <a
            href="#/cursos"
            class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8 transition"
        >
            ← Volver al catálogo
        </a>

        <section class="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-10">

            <span class="inline-flex items-center px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-5">
                ${escapeHTML(curso.nivel)}
            </span>

            <h1 class="text-4xl font-bold text-gray-900 mb-4">
                ${escapeHTML(curso.titulo)}
            </h1>
            <p class="text-lg leading-9 text-gray-600 max-w-3xl mt-5">
                ${escapeHTML(curso.descripcion || "")}
            </p>

            <div class="flex items-center gap-2 mt-8 text-gray-600 font-medium">
                <span class="text-xl">📚</span>
                <span>${lecciones.length} lecciones disponibles</span>
            </div>

            <div id="barra-progreso"></div>

        </section>

        <div id="invitacion-registro"></div>

        <section>

            <div class="mt-12">
                <h3 class="text-3xl font-bold mb-6">
                    Lecciones del curso
                </h3>

                <div id="lista-lecciones" class="space-y-4"></div>
            </div>

        </section>
    `;

    app.appendChild(contenedor);

    // Barra de progreso: solo para estudiantes con datos de avance
    if (progreso) {
        const barra = contenedor.querySelector("#barra-progreso");
        barra.className = "mt-6";
        barra.innerHTML = `
            <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Tu avance: ${progreso.lecciones_completadas} de ${progreso.total_lecciones} lecciones</span>
                <span class="font-semibold text-blue-700">${progreso.porcentaje}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-3">
                <div class="bg-blue-600 h-3 rounded-full transition-all" style="width: ${Math.min(progreso.porcentaje, 100)}%"></div>
            </div>
        `;
    }

    // Sin sesión: lecciones bloqueadas + invitación a registrarse (criterio de la issue)
    if (sinSesion) {
        const invitacion = contenedor.querySelector("#invitacion-registro");
        invitacion.className = "bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4";
        invitacion.innerHTML = `
            <p class="text-gray-700 font-medium">Regístrate gratis para empezar este curso y guardar tu progreso.</p>
            <a href="#/registro" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shrink-0">
                Regístrate gratis
            </a>
        `;
    }

    const listaLecciones = contenedor.querySelector("#lista-lecciones");

    if (Array.isArray(lecciones)) {

        lecciones.sort((a, b) => a.orden - b.orden);

        lecciones.forEach((leccion) => {

            const enlace = document.createElement("a");

            if (sinSesion) {
                // Bloqueada: el enlace lleva al registro, no a la lección
                enlace.href = "#/registro";
                enlace.className = "flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200 opacity-75 hover:opacity-100 transition";
            } else {
                enlace.href = `#/lecciones/${leccion.id}`;
                enlace.className = "flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition";
            }

            const numero = document.createElement("span");
            numero.className = "w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0";
            numero.textContent = `${leccion.orden}.`;

            const titulo = document.createElement("span");
            titulo.className = "text-gray-700 flex-1";
            titulo.textContent = leccion.titulo;

            const estado = document.createElement("span");
            estado.className = "flex-shrink-0 text-sm";
            if (sinSesion) {
                estado.textContent = "🔒";
                estado.title = "Regístrate para acceder";
            } else if (esEstudiante && completadas.has(leccion.id)) {
                estado.textContent = "✔️";
                estado.title = "Completada";
            } else if (esEstudiante) {
                estado.textContent = "○";
                estado.className += " text-gray-300";
                estado.title = "Pendiente";
            }

            enlace.append(numero, titulo, estado);

            listaLecciones.appendChild(enlace);

        });

    }
}
