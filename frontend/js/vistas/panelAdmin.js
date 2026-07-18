import { apiGet, apiPut, apiDelete } from "../api.js";
import { escapeHTML } from "../ui.js";
import { obtenerUsuario, rolActual } from "../sesion.js";

// Cuantos usuarios por pagina. 5 mantiene la paginacion visible incluso con
// los pocos usuarios semilla (con 20 todo cabria en una sola pagina).
const TAMANIO_PAGINA = 5;

const NIVELES_ROL = [
    { valor: "", etiqueta: "Todos los roles" },
    { valor: "estudiante", etiqueta: "Estudiantes" },
    { valor: "profesor", etiqueta: "Profesores" },
    { valor: "admin", etiqueta: "Administradores" },
];

const ROLES_ASIGNABLES = ["estudiante", "profesor", "admin"];

const BADGE_ROL = {
    estudiante: "bg-blue-100 text-blue-700",
    profesor: "bg-purple-100 text-purple-700",
    admin: "bg-amber-100 text-amber-700",
};

const estado = {
    pagina: 1,
    rol: "",       // filtro por rol; "" = todos
    contenedor: null,
};

export function vistaPanelAdmin(app) {
    app.innerHTML = "";

    // Guardia de rol extra (el router ya protege #/panel-admin, pero defensa en profundidad)
    if (rolActual() !== "admin") {
        const aviso = document.createElement("div");
        aviso.className = "max-w-3xl mx-auto px-4 py-16 text-center";
        aviso.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Acceso restringido</h2>
            <p class="text-gray-500">Esta sección es solo para administradores.</p>
        `;
        app.appendChild(aviso);
        return;
    }

    // Reiniciar filtro y pagina cada vez que se entra a la vista
    estado.pagina = 1;
    estado.rol = "";

    const contenedor = document.createElement("div");
    contenedor.className = "max-w-6xl mx-auto px-6 py-10";
    contenedor.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Panel de administración</h1>
            <p class="text-gray-500 text-sm mt-1">Gestiona los usuarios de la plataforma: roles y estado de las cuentas.</p>
        </div>

        <div class="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <label class="text-sm text-gray-600 flex items-center gap-2">
                Filtrar por rol:
                <select id="filtro-rol" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer">
                    ${NIVELES_ROL.map(n => `<option value="${n.valor}">${n.etiqueta}</option>`).join("")}
                </select>
            </label>
        </div>

        <div id="tabla-contenedor" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"></div>

        <div id="paginacion" class="flex items-center justify-between mt-6"></div>
    `;

    app.appendChild(contenedor);
    estado.contenedor = contenedor;

    contenedor.querySelector("#filtro-rol").addEventListener("change", (e) => {
        estado.rol = e.target.value;
        estado.pagina = 1;   // al cambiar el filtro se vuelve a la primera pagina
        recargar();
    });

    recargar();
}

async function recargar() {
    const cont = estado.contenedor;
    if (!cont) return;

    const tabla = cont.querySelector("#tabla-contenedor");
    const paginacion = cont.querySelector("#paginacion");

    tabla.innerHTML = `<div class="p-10 text-center text-gray-400">Cargando usuarios...</div>`;
    paginacion.innerHTML = "";

    let ruta = `/admin/usuarios?pagina=${estado.pagina}&tamanio=${TAMANIO_PAGINA}`;
    if (estado.rol) ruta += `&rol=${estado.rol}`;

    let datos;
    try {
        datos = await apiGet(ruta);
    } catch (error) {
        tabla.innerHTML = `
            <div class="p-10 text-center">
                <p class="text-red-600 font-medium mb-3" id="admin-error"></p>
                <button id="btn-reintentar" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">Reintentar</button>
            </div>
        `;
        tabla.querySelector("#admin-error").textContent = error.message;
        tabla.querySelector("#btn-reintentar").addEventListener("click", recargar);
        return;
    }

    renderTabla(tabla, datos.usuarios);
    renderPaginacion(paginacion, datos);
}

function renderTabla(tabla, usuarios) {
    if (!usuarios || usuarios.length === 0) {
        tabla.innerHTML = `<div class="p-10 text-center text-gray-400">No hay usuarios que coincidan con el filtro.</div>`;
        return;
    }

    const yoId = obtenerUsuario()?.id;

    tabla.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-100 text-left text-gray-500">
                        <th class="px-6 py-4 font-semibold">Nombre</th>
                        <th class="px-6 py-4 font-semibold">Email</th>
                        <th class="px-6 py-4 font-semibold">Rol</th>
                        <th class="px-6 py-4 font-semibold">Estado</th>
                        <th class="px-6 py-4 font-semibold text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody id="filas-usuarios"></tbody>
            </table>
        </div>
    `;

    const tbody = tabla.querySelector("#filas-usuarios");

    usuarios.forEach(usuario => {
        const esYo = usuario.id === yoId;
        const fila = document.createElement("tr");
        fila.className = "border-b border-gray-50 hover:bg-gray-50/50 transition-colors";

        fila.innerHTML = `
            <td class="px-6 py-4 font-medium text-gray-900" data-nombre></td>
            <td class="px-6 py-4 text-gray-500" data-email></td>
            <td class="px-6 py-4">
                <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${BADGE_ROL[usuario.rol] || "bg-gray-100 text-gray-700"}">
                    ${escapeHTML(usuario.rol)}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-medium ${usuario.activo ? "text-green-600" : "text-gray-400"}">
                    <span class="w-2 h-2 rounded-full ${usuario.activo ? "bg-green-500" : "bg-gray-300"}"></span>
                    ${usuario.activo ? "Activo" : "Inactivo"}
                </span>
            </td>
            <td class="px-6 py-4 text-right" data-acciones></td>
        `;

        // Nombre y email con textContent: los escribió el usuario en el registro
        fila.querySelector("[data-nombre]").textContent = usuario.nombre;
        fila.querySelector("[data-email]").textContent = usuario.email;

        const acciones = fila.querySelector("[data-acciones]");
        if (esYo) {
            // Regla de autoproteccion: el admin no se opera a si mismo desde la interfaz
            // (el backend ademas lo rechaza, esto solo evita mostrar botones inutiles)
            acciones.innerHTML = `<span class="text-xs text-gray-400 italic">Tu cuenta</span>`;
        } else {
            const btnRol = document.createElement("button");
            btnRol.className = "text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 cursor-pointer";
            btnRol.textContent = "Cambiar rol";
            btnRol.addEventListener("click", () => abrirModalRol(usuario));
            acciones.appendChild(btnRol);

            const btnEstado = document.createElement("button");
            if (usuario.activo) {
                btnEstado.className = "text-red-500 hover:text-red-600 text-xs font-medium px-2 py-1 cursor-pointer";
                btnEstado.textContent = "Desactivar";
                btnEstado.addEventListener("click", () => confirmarAccion(
                    `¿Desactivar la cuenta de "${usuario.nombre}"? No podrá iniciar sesión, pero su historial se conserva.`,
                    "Desactivar",
                    "bg-red-600 hover:bg-red-700",
                    () => apiDelete(`/admin/usuarios/${usuario.id}`)
                ));
            } else {
                btnEstado.className = "text-green-600 hover:text-green-700 text-xs font-medium px-2 py-1 cursor-pointer";
                btnEstado.textContent = "Reactivar";
                btnEstado.addEventListener("click", () => confirmarAccion(
                    `¿Reactivar la cuenta de "${usuario.nombre}"? Volverá a poder iniciar sesión.`,
                    "Reactivar",
                    "bg-green-600 hover:bg-green-700",
                    () => apiPut(`/admin/usuarios/${usuario.id}/activar`)
                ));
            }
            acciones.appendChild(btnEstado);
        }

        tbody.appendChild(fila);
    });
}

function renderPaginacion(paginacion, datos) {
    const { pagina, total_paginas, total } = datos;

    if (total === 0) {
        paginacion.innerHTML = "";
        return;
    }

    paginacion.innerHTML = `
        <span class="text-sm text-gray-500">${total} usuario(s) · página ${pagina} de ${total_paginas}</span>
        <div class="flex gap-2">
            <button id="btn-anterior" class="px-4 py-2 text-sm rounded-lg border border-gray-300 transition-colors ${pagina <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50 cursor-pointer"}" ${pagina <= 1 ? "disabled" : ""}>← Anterior</button>
            <button id="btn-siguiente" class="px-4 py-2 text-sm rounded-lg border border-gray-300 transition-colors ${pagina >= total_paginas ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50 cursor-pointer"}" ${pagina >= total_paginas ? "disabled" : ""}>Siguiente →</button>
        </div>
    `;

    const btnAnterior = paginacion.querySelector("#btn-anterior");
    const btnSiguiente = paginacion.querySelector("#btn-siguiente");

    if (pagina > 1) {
        btnAnterior.addEventListener("click", () => { estado.pagina--; recargar(); });
    }
    if (pagina < total_paginas) {
        btnSiguiente.addEventListener("click", () => { estado.pagina++; recargar(); });
    }
}

// ---------------------------------------------------------------------------
// Modal de cambio de rol: select con los 3 roles + confirmacion explicita
// ---------------------------------------------------------------------------
function abrirModalRol(usuario) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4";

    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-2xl w-full max-w-md p-6";
    card.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-900 mb-1">Cambiar rol</h3>
        <p class="text-sm text-gray-500 mb-4" data-usuario></p>
        <select id="select-rol" class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            ${ROLES_ASIGNABLES.map(r => `<option value="${r}" ${r === usuario.rol ? "selected" : ""}>${r}</option>`).join("")}
        </select>
        <div class="flex justify-end gap-3">
            <button data-cancelar class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">Cancelar</button>
            <button data-guardar class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50">Guardar</button>
        </div>
    `;
    // nombre del usuario con textContent (dato de la API)
    card.querySelector("[data-usuario]").textContent = `Usuario: ${usuario.nombre}`;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const cerrar = () => overlay.remove();
    overlay.addEventListener("click", (e) => { if (e.target === overlay) cerrar(); });
    card.querySelector("[data-cancelar]").addEventListener("click", cerrar);

    const btnGuardar = card.querySelector("[data-guardar]");
    btnGuardar.addEventListener("click", async () => {
        const nuevoRol = card.querySelector("#select-rol").value;
        if (nuevoRol === usuario.rol) { cerrar(); return; }  // sin cambios
        btnGuardar.disabled = true;
        btnGuardar.textContent = "Guardando...";
        try {
            await apiPut(`/admin/usuarios/${usuario.id}/rol`, { rol: nuevoRol });
            cerrar();
            mostrarToast(`Rol de ${usuario.nombre} actualizado a ${nuevoRol}.`);
            recargar();
        } catch (error) {
            btnGuardar.disabled = false;
            btnGuardar.textContent = "Guardar";
            mostrarToast(error.message, "error");
        }
    });
}

// ---------------------------------------------------------------------------
// Modal de confirmacion generico (desactivar / reactivar)
// ---------------------------------------------------------------------------
function confirmarAccion(mensaje, textoBoton, colorBoton, accion) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4";

    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-2xl w-full max-w-md p-6";
    card.innerHTML = `
        <p class="text-gray-700 mb-6" data-mensaje></p>
        <div class="flex justify-end gap-3">
            <button data-cancelar class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">Cancelar</button>
            <button data-confirmar class="px-4 py-2 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${colorBoton}">${textoBoton}</button>
        </div>
    `;
    card.querySelector("[data-mensaje]").textContent = mensaje;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const cerrar = () => overlay.remove();
    overlay.addEventListener("click", (e) => { if (e.target === overlay) cerrar(); });
    card.querySelector("[data-cancelar]").addEventListener("click", cerrar);

    const btnConfirmar = card.querySelector("[data-confirmar]");
    btnConfirmar.addEventListener("click", async () => {
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = "Procesando...";
        try {
            await accion();
            cerrar();
            mostrarToast("Acción realizada correctamente.");
            recargar();
        } catch (error) {
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = textoBoton;
            mostrarToast(error.message, "error");
        }
    });
}

function mostrarToast(mensaje, tipo = "exito") {
    const existente = document.querySelector(".admin-toast");
    if (existente) existente.remove();
    const div = document.createElement("div");
    div.className = `admin-toast fixed top-4 right-4 z-50 text-white px-6 py-3 rounded-lg shadow-lg ${tipo === "error" ? "bg-red-600" : "bg-green-600"}`;
    div.textContent = mensaje;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}
