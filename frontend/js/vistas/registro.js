import { apiPost } from "../api.js";
import { navegarA, obtenerMensajeFlash } from "../app.js";

export function vistaRegistro(app) {
    app.innerHTML = "";
    const contenedor = document.createElement("div");
    contenedor.className = "min-h-screen bg-gray-50 flex items-center justify-center p-4";
    contenedor.innerHTML = `
        <main class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <!-- Logo placeholder -->
            <div class="flex justify-center mb-8">
                <div id="logo-placeholder" class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <!-- Logo irá aquí -->
                    <svg class="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"></path>
                    </svg>
                </div>
            </div>

            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p class="text-gray-500 text-sm">Join thousands of learners on EduLogic</p>
            </div>

            <!-- Form -->
            <form id="formRegistro" class="space-y-5" novalidate>
                <!-- Name -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5" for="nombre">Full Name</label>
                    <input type="text" id="nombre" name="nombre" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm" placeholder="Juan Pérez" required autocomplete="name" minlength="3">
                    <p id="errorNombre" class="text-red-600 text-xs mt-1 hidden"></p>
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5" for="email">Email</label>
                    <input type="email" id="email" name="email" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm" placeholder="you@example.com" required autocomplete="email">
                    <p id="errorEmail" class="text-red-600 text-xs mt-1 hidden"></p>
                </div>

                <!-- Password -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5" for="contrasena">Password</label>
                    <div class="relative">
                        <input type="password" id="contrasena" name="contrasena" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm pr-12" placeholder="••••••••" required autocomplete="new-password" minlength="8">
                        <button type="button" id="togglePassword" aria-label="Toggle password visibility" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                    <p id="errorContrasena" class="text-red-600 text-xs mt-1 hidden"></p>
                </div>

                <!-- Confirm Password -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5" for="confirmarContrasena">Confirm Password</label>
                    <div class="relative">
                        <input type="password" id="confirmarContrasena" name="confirmarContrasena" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm pr-12" placeholder="••••••••" required autocomplete="new-password">
                        <button type="button" id="toggleConfirmPassword" aria-label="Toggle confirm password visibility" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                        </button>
                    </div>
                    <p id="errorConfirmar" class="text-red-600 text-xs mt-1 hidden"></p>
                </div>

                <!-- Error general -->
                <p id="errorGeneral" class="text-red-600 text-sm text-center hidden"></p>

                <!-- Submit -->
                <button type="submit" id="btnRegistro" class="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <span>Create Account</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                </button>
            </form>

            <!-- Divider -->
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-white px-4 text-gray-400 font-medium tracking-wider">Or continue with</span>
                </div>
            </div>

            <!-- SSO Buttons -->
            <div class="grid grid-cols-2 gap-3">
                <button type="button" class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    <div class="w-5 h-5 rounded bg-gray-100 flex items-center justify-center" id="institution-icon">
                        <!-- Institution icon placeholder -->
                    </div>
                    <span>Institution</span>
                </button>
                <button type="button" class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    <div class="w-5 h-5 rounded bg-gray-100 flex items-center justify-center" id="biometric-icon">
                        <!-- Biometric icon placeholder -->
                    </div>
                    <span>Biometric</span>
                </button>
            </div>

            <!-- Login link -->
            <p class="text-center text-sm text-gray-500 mt-6">
                Already have an account? <a href="#/login" class="text-blue-600 hover:underline font-medium">Sign In</a>
            </p>
        </main>
    `;
    app.appendChild(contenedor);

    // Toast flash message
    const mensajeFlash = obtenerMensajeFlash();
    if (mensajeFlash) {
        const toast = document.createElement("div");
        toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50";
        toast.textContent = mensajeFlash;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    const form = document.getElementById("formRegistro");
    const btnRegistro = document.getElementById("btnRegistro");
    const errorGeneral = document.getElementById("errorGeneral");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("contrasena");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const confirmPasswordInput = document.getElementById("confirmarContrasena");

    // Password toggle
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        togglePassword.innerHTML = type === "password"
            ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>`
            : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.955 9.955 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L3 3m13.59 13.59l1.59 1.59" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>`;
    });

    toggleConfirmPassword.addEventListener("click", () => {
        const type = confirmPasswordInput.type === "password" ? "text" : "password";
        confirmPasswordInput.type = type;
        toggleConfirmPassword.innerHTML = type === "password"
            ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>`
            : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.955 9.955 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L3 3m13.59 13.59l1.59 1.59" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>`;
    });

    const validaciones = {
        nombre: {
            elemento: document.getElementById("nombre"),
            error: document.getElementById("errorNombre"),
            validar: (valor) => {
                if (!valor.trim()) return "Name is required";
                if (valor.trim().length < 3) return "Minimum 3 characters";
                return "";
            }
        },
        email: {
            elemento: document.getElementById("email"),
            error: document.getElementById("errorEmail"),
            validar: (valor) => {
                if (!valor.trim()) return "Email is required";
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!regex.test(valor)) return "Invalid email format";
                return "";
            }
        },
        contrasena: {
            elemento: document.getElementById("contrasena"),
            error: document.getElementById("errorContrasena"),
            validar: (valor) => {
                if (!valor) return "Password is required";
                if (valor.length < 8) return "Minimum 8 characters";
                return "";
            }
        },
        confirmarContrasena: {
            elemento: document.getElementById("confirmarContrasena"),
            error: document.getElementById("errorConfirmar"),
            validar: (valor, formulario) => {
                if (!valor) return "Confirm your password";
                if (valor !== formulario.contrasena.value) return "Passwords do not match";
                return "";
            }
        }
    };

    function mostrarError(campo, mensaje) {
        campo.error.textContent = mensaje;
        campo.error.classList.remove("hidden");
        campo.elemento.classList.add("border-red-500", "focus:ring-red-500");
        campo.elemento.classList.remove("border-gray-200");
    }

    function limpiarError(campo) {
        campo.error.classList.add("hidden");
        campo.elemento.classList.remove("border-red-500", "focus:ring-red-500");
        campo.elemento.classList.add("border-gray-200");
    }

    function validarCampo(nombreCampo) {
        const campo = validaciones[nombreCampo];
        const valor = campo.elemento.value;
        const formulario = {
            nombre: validaciones.nombre.elemento.value,
            email: validaciones.email.elemento.value,
            contrasena: validaciones.contrasena.elemento.value,
            confirmarContrasena: validaciones.confirmarContrasena.elemento.value
        };
        const error = campo.validar(valor, formulario);
        if (error) {
            mostrarError(campo, error);
            return false;
        } else {
            limpiarError(campo);
            return true;
        }
    }

    function validarTodo() {
        let valido = true;
        for (const key of Object.keys(validaciones)) {
            if (!validarCampo(key)) {
                valido = false;
            }
        }
        return valido;
    }

    Object.keys(validaciones).forEach(key => {
        validaciones[key].elemento.addEventListener("blur", () => validarCampo(key));
        validaciones[key].elemento.addEventListener("input", () => {
            if (!validaciones[key].error.classList.contains("hidden")) {
                validarCampo(key);
            }
        });
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorGeneral.classList.add("hidden");

        if (!validarTodo()) {
            return;
        }

        btnRegistro.disabled = true;
        btnRegistro.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Creating account...</span>
        `;

        const datos = {
            nombre: validaciones.nombre.elemento.value.trim(),
            email: validaciones.email.elemento.value.trim(),
            contrasena: validaciones.contrasena.elemento.value,
            rol: "estudiante"
        };

        try {
            await apiPost("/auth/registro", datos);
            navegarA("/login", "¡Cuenta creada! Ya puedes iniciar sesión.");
        } catch (error) {
            errorGeneral.textContent = error.message || "Error creating account";
            errorGeneral.classList.remove("hidden");
        } finally {
            btnRegistro.disabled = false;
            btnRegistro.innerHTML = `
                <span>Create Account</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
            `;
        }
    });
}