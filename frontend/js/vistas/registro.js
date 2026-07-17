import { apiPost } from "../api.js";
import { navegarA, obtenerMensajeFlash } from "../sesion.js";

function validarNombre(nombre) {
    if (!nombre.trim()) return "El nombre es obligatorio.";
    if (nombre.trim().length < 3) return "El nombre debe tener al menos 3 caracteres.";
    return "";
}

function validarEmail(email) {
    if (!email.trim()) return "El correo electronico es obligatorio.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.trim())) return "Ingresa un correo electronico valido.";
    return "";
}

function validarContrasena(contrasena) {
    if (!contrasena) return "La contrasena es obligatoria.";
    if (contrasena.length < 8) return "Debe tener al menos 8 caracteres.";
    return "";
}

function validarConfirmacion(contrasena, confirmacion) {
    if (!confirmacion) return "Confirma tu contrasena.";
    if (contrasena !== confirmacion) return "Las contrasenas no coinciden.";
    return "";
}

function mostrarErrorCampo(input, mensaje) {
    const contenedor = input.closest(".campo-contenedor");
    let spanError = contenedor.querySelector(".error-campo");
    if (!mensaje) {
        if (spanError) spanError.remove();
        input.style.borderColor = "#d1d5db";
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

export function vistaRegistro(app) {
    app.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.className = "min-h-screen bg-gray-50 flex items-center justify-center p-8";

    contenedor.innerHTML = `
        <div class="w-full max-w-md bg-white rounded-xl shadow-md p-8">
            <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">Crear cuenta</h1>
            <p class="text-gray-500 text-sm text-center mb-6">Ingresa tus datos para registrarte en EduLogic.</p>

            <form id="formRegistro" class="space-y-4" novalidate>
                <div class="campo-contenedor">
                    <label for="registroNombre" class="block mb-1 font-medium text-gray-700 text-sm">Nombre completo</label>
                    <input
                        type="text"
                        id="registroNombre"
                        name="nombre"
                        placeholder="Tu nombre"
                        autocomplete="name"
                        class="w-full px-4 py-4 rounded-lg border border-gray-300 outline-none text-sm"
                        style="border-width:1px;border-style:solid;">
                </div>

                <div class="campo-contenedor">
                    <label for="registroEmail" class="block mb-1 font-medium text-gray-700 text-sm">Correo electronico</label>
                    <input
                        type="email"
                        id="registroEmail"
                        name="email"
                        placeholder="estudiante@ejemplo.com"
                        autocomplete="email"
                        class="w-full px-4 py-4 rounded-lg border border-gray-300 outline-none text-sm"
                        style="border-width:1px;border-style:solid;">
                </div>

                <div class="campo-contenedor">
                    <label class="block mb-2 font-medium text-gray-700 text-sm">Tipo de cuenta</label>
                    <div class="flex gap-3">
                        <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-400 transition-colors has-checked:border-blue-600 has-checked:bg-blue-50" id="label-rol-estudiante">
                            <input type="radio" name="rol" value="estudiante" checked class="cursor-pointer">
                            <span class="text-sm font-medium text-gray-700">Estudiante</span>
                        </label>
                        <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-400 transition-colors has-checked:border-blue-600 has-checked:bg-blue-50" id="label-rol-profesor">
                            <input type="radio" name="rol" value="profesor" class="cursor-pointer">
                            <span class="text-sm font-medium text-gray-700">Profesor</span>
                        </label>
                    </div>
                </div>

                <div class="campo-contenedor">
                    <label for="registroContrasena" class="block mb-1 font-medium text-gray-700 text-sm">Contrasena</label>
                    <div class="relative">
                        <input
                            type="password"
                            id="registroContrasena"
                            name="contrasena"
                            placeholder="Minimo 8 caracteres"
                            autocomplete="new-password"
                            class="w-full px-4 py-4 rounded-lg border border-gray-300 outline-none text-sm pr-12"
                            style="border-width:1px;border-style:solid;">
                        <button
                            type="button"
                            class="absolute cursor-pointer opacity-70 btn-ojo-contrasena"
                            style="right:12px;top:50%;transform:translateY(-50%);background:none;border:none;padding:4px;"
                            aria-label="Mostrar u ocultar contrasena">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:#6b7280;">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                            </svg>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">Minimo 8 caracteres. Usa una combinacion segura.</p>
                </div>

                <div class="campo-contenedor">
                    <label for="registroConfirmar" class="block mb-1 font-medium text-gray-700 text-sm">Confirmar contrasena</label>
                    <div class="relative">
                        <input
                            type="password"
                            id="registroConfirmar"
                            name="confirmar"
                            placeholder="Repite tu contrasena"
                            autocomplete="new-password"
                            class="w-full px-4 py-4 rounded-lg border border-gray-300 outline-none text-sm pr-12"
                            style="border-width:1px;border-style:solid;">
                        <button
                            type="button"
                            class="absolute cursor-pointer opacity-70 btn-ojo-confirmar"
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
                    id="btnRegistroSubmit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors cursor-pointer text-sm">
                    Crear cuenta
                </button>
            </form>

            <p class="text-center text-gray-500 text-sm mt-8">
                Ya tienes cuenta? <a href="#/login" class="text-blue-600 font-medium hover:underline">Inicia sesion</a>
            </p>
        </div>
    `;

    app.appendChild(contenedor);

    const formulario = contenedor.querySelector("#formRegistro");
    const inputNombre = contenedor.querySelector("#registroNombre");
    const inputEmail = contenedor.querySelector("#registroEmail");
    const inputContrasena = contenedor.querySelector("#registroContrasena");
    const inputConfirmar = contenedor.querySelector("#registroConfirmar");
    const inputsRol = contenedor.querySelectorAll("input[name='rol']");
    const btnSubmit = contenedor.querySelector("#btnRegistroSubmit");
    const btnOjoContrasena = contenedor.querySelector(".btn-ojo-contrasena");
    const btnOjoConfirmar = contenedor.querySelector(".btn-ojo-confirmar");

    gestionarVisibilidadContrasena(btnOjoContrasena, inputContrasena);
    gestionarVisibilidadContrasena(btnOjoConfirmar, inputConfirmar);

    inputNombre.addEventListener("blur", () => {
        mostrarErrorCampo(inputNombre, validarNombre(inputNombre.value));
    });
    inputNombre.addEventListener("input", () => {
        mostrarErrorCampo(inputNombre, validarNombre(inputNombre.value));
    });

    inputEmail.addEventListener("blur", () => {
        mostrarErrorCampo(inputEmail, validarEmail(inputEmail.value));
    });
    inputEmail.addEventListener("input", () => {
        mostrarErrorCampo(inputEmail, validarEmail(inputEmail.value));
    });

    inputContrasena.addEventListener("blur", () => {
        const err = validarContrasena(inputContrasena.value);
        mostrarErrorCampo(inputContrasena, err);
        if (inputConfirmar.value) {
            mostrarErrorCampo(inputConfirmar, validarConfirmacion(inputContrasena.value, inputConfirmar.value));
        }
    });
    inputContrasena.addEventListener("input", () => {
        const err = validarContrasena(inputContrasena.value);
        mostrarErrorCampo(inputContrasena, err);
        if (inputConfirmar.value) {
            mostrarErrorCampo(inputConfirmar, validarConfirmacion(inputContrasena.value, inputConfirmar.value));
        }
    });

    inputConfirmar.addEventListener("blur", () => {
        mostrarErrorCampo(inputConfirmar, validarConfirmacion(inputContrasena.value, inputConfirmar.value));
    });
    inputConfirmar.addEventListener("input", () => {
        mostrarErrorCampo(inputConfirmar, validarConfirmacion(inputContrasena.value, inputConfirmar.value));
    });

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        limpiarErrorGeneral(formulario);

        const nombre = inputNombre.value;
        const email = inputEmail.value;
        const contrasena = inputContrasena.value;
        const confirmar = inputConfirmar.value;

        const errNombre = validarNombre(nombre);
        const errEmail = validarEmail(email);
        const errContrasena = validarContrasena(contrasena);
        const errConfirmar = validarConfirmacion(contrasena, confirmar);

        mostrarErrorCampo(inputNombre, errNombre);
        mostrarErrorCampo(inputEmail, errEmail);
        mostrarErrorCampo(inputContrasena, errContrasena);
        mostrarErrorCampo(inputConfirmar, errConfirmar);

        if (errNombre || errEmail || errContrasena || errConfirmar) return;

        btnSubmit.disabled = true;
        btnSubmit.style.opacity = "0.7";
        btnSubmit.textContent = "Creando cuenta...";

        const rolSeleccionado = Array.from(inputsRol).find(r => r.checked)?.value || "estudiante";

        try {
            await apiPost("/auth/registro", {
                nombre: nombre.trim(),
                email: email.trim(),
                contrasena: contrasena,
                rol: rolSeleccionado,
            });

            navegarA("/login", "Cuenta creada con exito! Inicia sesion para continuar.");
        } catch (err) {
            mostrarErrorGeneral(formulario, err.message || "Error al crear la cuenta. Intenta de nuevo.");
            btnSubmit.disabled = false;
            btnSubmit.style.opacity = "1";
            btnSubmit.textContent = "Crear cuenta";
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