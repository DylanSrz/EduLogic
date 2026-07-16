# ⚙️ Backend — EduLogic API

API REST de EduLogic construida con **FastAPI** (Python). Contiene la lógica de negocio de la plataforma: autenticación, gestión de cursos y lecciones, motor de evaluación con retroalimentación y progreso del estudiante.

## Requisitos

- **Python 3.11 o superior** (instalador oficial: https://www.python.org/downloads/)
- Verificar en la terminal: `python --version`

## 🚀 Instalación desde cero

Todos los comandos se ejecutan **dentro de la carpeta `backend/`**.

### 1. Crear el entorno virtual (solo la primera vez)

```bash
python -m venv .venv
```

El entorno virtual aísla las librerías de este proyecto de las del resto del sistema. La carpeta `.venv/` es local y NO se sube al repositorio.

### 2. Activar el entorno virtual (SIEMPRE antes de trabajar)

| Terminal | Comando |
|---|---|
| **Git Bash** | `source .venv/Scripts/activate` |
| **CMD** | `.venv\Scripts\activate` |
| **PowerShell** | `.venv\Scripts\Activate.ps1` |

Sabrás que está activo porque el prompt muestra `(.venv)` al inicio. Regla del equipo: **nunca instalar nada sin el entorno activado**.

### 3. Instalar las dependencias

```bash
pip install -r requirements.txt
```

Instala exactamente las mismas versiones que usa todo el equipo. Si en el futuro instalas una librería nueva, congélala con `pip freeze > requirements.txt` e inclúyela en tu PR.

### 4. Configurar las variables de entorno

Copia `.env.example` como `.env` y completa los valores reales (pedirlos por el canal privado del equipo en Discord):

```bash
cp .env.example .env
```

⚠️ El archivo `.env` contiene credenciales: está ignorado por Git y **jamás se sube al repositorio**.

## ▶️ Ejecutar el servidor

Con el entorno activado:

```bash
fastapi dev app/main.py
```

El modo `dev` recarga el servidor automáticamente al guardar cambios. Verificar que funciona:

| URL | Qué debe verse |
|---|---|
| http://127.0.0.1:8000/health | `{"estado": "ok"}` — la API está viva |
| http://127.0.0.1:8000/health/db | `{"base_de_datos": "conectada"}` — la conexión a PostgreSQL (Supabase) funciona. Si falla, revisar la `DATABASE_URL` del `.env` |
| http://127.0.0.1:8000/docs | Documentación interactiva automática: aquí se prueban TODOS los endpoints |

Para detener el servidor: `Ctrl+C`.

## 📁 Estructura del proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # Punto de entrada: crea la app y registra los routers
│   ├── routers/          # Endpoints agrupados por recurso (reciben HTTP y delegan)
│   ├── schemas/          # Formas de los datos de entrada/salida (Pydantic)
│   ├── services/         # Lógica de negocio (ej: motor de evaluación)
│   └── models/           # Tablas de la base de datos como clases (SQLAlchemy)
├── .env.example          # Plantilla de variables de entorno (sin valores reales)
├── .env                  # Valores reales — LOCAL, nunca se sube
└── requirements.txt      # Dependencias con versiones congeladas
```

**Separación de responsabilidades:** los `routers/` no contienen lógica de negocio (solo reciben, validan permisos y delegan) y los `services/` no saben nada de HTTP. Así la lógica se puede probar sin montar un servidor y el código queda legible.

## 🛠️ Problemas comunes

| Problema | Solución |
|---|---|
| `python` no se reconoce | Instalar Python con el instalador oficial y abrir una terminal NUEVA |
| `pip install` falla o instala en el lugar equivocado | Verificar que el prompt muestra `(.venv)` — el entorno no está activado |
| El servidor no arranca por un import | Ejecutar desde `backend/` (no desde la raíz del repo) |
| `/docs` no muestra un endpoint nuevo | Verificar que el router esté registrado en `app/main.py` |
