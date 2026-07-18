import { apiPost, guardarToken } from "../api.js";
import { guardarUsuario, navegarA, obtenerMensajeFlash, obtenerRutaDestino, actualizarHeader } from "../sesion.js";

function validarEmail(email) {
    if (!email.trim()) return "El correo electronico es obligatorio.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.trim())) return "Ingresa un correo electronico valido.";
    return "";
}

function validarContrasena(contrasena) {
    if (!contrasena) return "La contrasena es obligatoria.";
    if (contrasena.length < 8) return "La contrasena debe tener al menos 8 caracteres.";
    return "";
}

function mostrarErrorCampo(input, mensaje) {
    const contenedor = input.closest("div");
    let spanError = contenedor.querySelector(".error-campo");
    if (!mensaje) {
        if (spanError) spanError.remove();
        input.style.borderColor = "#D6DBE7";
        return;
    }
    if (!spanError) {
        spanError = document.createElement("p");
        spanError.className = "error-campo text-red-500 text-xs mt-2";
        contenedor.appendChild(spanError);
    }
    spanError.textContent = mensaje;
    input.style.borderColor = "#ef4444";
}

function mostrarErrorGeneral(formulario, mensaje) {
    let errorDiv = formulario.querySelector(".error-general");
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "error-general bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-400";
        formulario.insertBefore(errorDiv, formulario.firstChild);
    }
    errorDiv.textContent = mensaje;
}

function limpiarErrorGeneral(formulario) {
    const errorDiv = formulario.querySelector(".error-general");
    if (errorDiv) errorDiv.remove();
}

function gestionarVisibilidadContrasena(btn, input) {
    let visible = false;
    btn.addEventListener("click", () => {
        visible = !visible;
        input.type = visible ? "text" : "password";
        const svg = btn.querySelector("svg");
        if (visible) {
            svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`;
        } else {
            svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>`;
        }
    });
}

export function vistaLogin(app) {
    app.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.className = "h-full bg-gray-50 flex items-center justify-center p-8";

    contenedor.innerHTML = `
        <div class="w-full max-w-md bg-white rounded-3xl border-2 border-gray-900 shadow-ludica p-8">
            <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">Iniciar sesion</h1>
            <p class="text-gray-500 text-sm text-center mb-6">Ingresa tus credenciales para continuar.</p>

            <form id="formLogin" class="space-y-4" novalidate>
                <div>
                    <label for="loginEmail" class="block mb-1 font-medium text-gray-700 text-sm">Correo electronico</label>
                    <input
                        type="email"
                        id="loginEmail"
                        name="email"
                        placeholder="estudiante@ejemplo.com"
                        autocomplete="email"
                        class="w-full px-4 py-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                        style="border-width:1px;border-style:solid;">
                </div>

                <div>
                    <label for="loginContrasena" class="block mb-1 font-medium text-gray-700 text-sm">Contrasena</label>
                    <div class="relative">
                        <input
                            type="password"
                            id="loginContrasena"
                            name="contrasena"
                            placeholder="••••••••"
                            autocomplete="current-password"
                            class="w-full px-4 py-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 text-sm pr-12"
                            style="border-width:1px;border-style:solid;">
                        <button
                            type="button"
                            class="absolute cursor-pointer opacity-70"
                            style="right:12px;top:50%;transform:translateY(-50%);background:none;border:none;padding:4px;"
                            aria-label="Mostrar u ocultar contrasena">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:#6b7280;">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    id="btnLoginSubmit"
                    class="w-full bg-blue-600 text-white font-bold py-4 rounded-full border-2 border-gray-900 shadow-ludica-sm hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:scale-[0.98] transition-all cursor-pointer text-sm">
                    Iniciar sesion
                </button>
            </form>

            <p class="text-center text-gray-500 text-sm mt-8">
                No tienes cuenta? <a href="#/registro" class="text-blue-600 font-medium hover:underline">Registrate</a>
            </p>
        </div>
    `;

    app.appendChild(contenedor);

    const formulario = contenedor.querySelector("#formLogin");
    const inputEmail = contenedor.querySelector("#loginEmail");
    const inputContrasena = contenedor.querySelector("#loginContrasena");
    const btnSubmit = contenedor.querySelector("#btnLoginSubmit");
    const btnOjo = contenedor.querySelector("button[aria-label='Mostrar u ocultar contrasena']");

    gestionarVisibilidadContrasena(btnOjo, inputContrasena);

    inputEmail.addEventListener("blur", () => {
        const error = validarEmail(inputEmail.value);
        mostrarErrorCampo(inputEmail, error);
    });

    inputEmail.addEventListener("input", () => {
        const error = validarEmail(inputEmail.value);
        mostrarErrorCampo(inputEmail, error);
    });

    inputContrasena.addEventListener("blur", () => {
        const error = validarContrasena(inputContrasena.value);
        mostrarErrorCampo(inputContrasena, error);
    });

    inputContrasena.addEventListener("input", () => {
        const error = validarContrasena(inputContrasena.value);
        mostrarErrorCampo(inputContrasena, error);
    });

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        limpiarErrorGeneral(formulario);

        const errorEmail = validarEmail(inputEmail.value);
        const errorContrasena = validarContrasena(inputContrasena.value);

        mostrarErrorCampo(inputEmail, errorEmail);
        mostrarErrorCampo(inputContrasena, errorContrasena);

        if (errorEmail || errorContrasena) return;

        btnSubmit.disabled = true;
        btnSubmit.style.opacity = "0.7";
        btnSubmit.textContent = "Iniciando sesion...";

        try {
            const datos = {
                email: inputEmail.value.trim(),
                contrasena: inputContrasena.value
            };
            const respuesta = await apiPost("/auth/login", datos);

            guardarToken(respuesta.access_token);
            guardarUsuario({
                id: respuesta.usuario.id,
                nombre: respuesta.usuario.nombre,
                email: respuesta.usuario.email,
                rol: respuesta.usuario.rol
            });

            actualizarHeader();

            const destino = obtenerRutaDestino() || "/cursos";
            navegarA(destino);
        } catch (err) {
            mostrarErrorGeneral(formulario, err.message || "Error al iniciar sesion. Intenta de nuevo.");
            btnSubmit.disabled = false;
            btnSubmit.style.opacity = "1";
            btnSubmit.textContent = "Iniciar sesion";
        }
    });

    const mensajeFlash = obtenerMensajeFlash();
    if (mensajeFlash) {
        const flashDiv = document.createElement("div");
        flashDiv.className = "bg-green-50 text-green-600 text-sm p-3 rounded-lg border border-green-500 mb-6";
        flashDiv.textContent = mensajeFlash;
        const tarjeta = contenedor.querySelector(".bg-white");
        tarjeta.insertBefore(flashDiv, formulario);
    }
}