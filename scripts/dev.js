// Levanta TODO EduLogic con un solo comando, en cualquier sistema operativo:
//   1. Backend  -> uvicorn (FastAPI) en http://127.0.0.1:8000
//   2. CSS      -> Tailwind en modo --watch (recompila estilos.css al guardar)
//   3. Frontend -> servidor estatico en http://localhost:5500 (mismo puerto que
//                  usaba Live Server, compatible con el CORS del backend)
//
// La unica diferencia entre sistemas operativos es la ruta del Python del
// entorno virtual; este script la resuelve segun process.platform.
//
// Requisitos previos (una sola vez):  npm install  &&  npm run setup
// y crear backend/.env con la cadena de Supabase (ver README / guia-de-inicio).

const path = require("path");

// concurrently exporta distinto entre versiones (v8 default, v9 named):
// resolvemos de forma defensiva para no atarnos a una.
const mod = require("concurrently");
const concurrently = mod.concurrently || mod.default || mod;

const esWindows = process.platform === "win32";

// Ruta ABSOLUTA al Python del venv del backend. Absoluta (no relativa) porque
// cada proceso corre con un cwd distinto (backend / frontend).
const pythonVenv = path.resolve(
    "backend",
    esWindows ? path.join(".venv", "Scripts", "python.exe")
              : path.join(".venv", "bin", "python")
);

// Las comillas protegen la ruta si el proyecto vive en una carpeta con espacios.
const py = `"${pythonVenv}"`;

const { result } = concurrently(
    [
        {
            name: "api",
            command: `${py} -m uvicorn app.main:app --reload`,
            cwd: "backend",
            prefixColor: "blue",
        },
        {
            name: "css",
            command: "npx @tailwindcss/cli -i css/entrada.css -o css/estilos.css --watch",
            cwd: "frontend",
            prefixColor: "magenta",
        },
        {
            name: "web",
            command: `${py} -m http.server 5500`,
            cwd: "frontend",
            prefixColor: "green",
        },
    ],
    {
        prefix: "name",
        // Si uno se cae (o se cierra con Ctrl+C), bajar todos los demas.
        killOthersOn: ["failure", "success"],
    }
);

result.then(
    () => process.exit(0),
    () => process.exit(1)
);
