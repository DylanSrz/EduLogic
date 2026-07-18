// Prepara un equipo recien clonado para correr EduLogic, en cualquier SO:
//   1. Crea el entorno virtual del backend (si no existe)
//   2. Instala las dependencias de Python (requirements.txt)
//   3. Instala las dependencias del frontend (Tailwind)
//   4. Compila el CSS una vez
//
// Queda UN paso manual imposible de automatizar (es secreto): crear
// backend/.env con la cadena de Supabase y el SECRET_KEY. Se avisa al final.
//
// Uso:  npm install   (una vez, para traer concurrently)
//       npm run setup

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const esWindows = process.platform === "win32";

function run(comando, cwd) {
    console.log(`\n> ${comando}${cwd ? `   (en ${cwd})` : ""}`);
    execSync(comando, { cwd, stdio: "inherit" });
}

// El comando de Python varia entre equipos: en muchos Mac/Linux es python3.
function detectarPython() {
    for (const cmd of ["python", "python3"]) {
        try {
            execSync(`${cmd} --version`, { stdio: "ignore" });
            return cmd;
        } catch {
            // probar el siguiente
        }
    }
    throw new Error(
        "No se encontró Python en el PATH. Instala Python 3 y vuelve a ejecutar 'npm run setup'."
    );
}

console.log("== Preparando EduLogic ==");

const py = detectarPython();
const rutaVenv = path.join("backend", ".venv");
const pyVenv = path.resolve(
    rutaVenv,
    esWindows ? path.join("Scripts", "python.exe") : path.join("bin", "python")
);

// 1. Entorno virtual del backend
if (fs.existsSync(rutaVenv)) {
    console.log("\n(el entorno virtual ya existe, se omite su creación)");
} else {
    run(`${py} -m venv .venv`, "backend");
}

// 2. Dependencias del backend
run(`"${pyVenv}" -m pip install --upgrade pip`, "backend");
run(`"${pyVenv}" -m pip install -r requirements.txt`, "backend");

// 3. Dependencias del frontend (Tailwind CLI)
run("npm install", "frontend");

// 4. Primera compilación del CSS
run("npx @tailwindcss/cli -i css/entrada.css -o css/estilos.css", "frontend");

console.log(`
========================================================================
  Preparación completa.

  FALTA UN PASO MANUAL (no se puede automatizar porque son secretos):

    Crea el archivo  backend/.env  con:
      - DATABASE_URL  (cadena de conexión a Supabase)
      - SECRET_KEY    (clave del JWT)
      - ACCESS_TOKEN_EXPIRE_MINUTES

    Pídelos por el canal privado del equipo.
    Usa  backend/.env.example  como plantilla.

  Luego, para levantar TODO con un solo comando:

    npm run dev

========================================================================
`);
