# 🚀 Guía de Inicio — EduLogic

> **Para quién es esta guía:** para todo integrante del equipo. Léela completa antes de la primera reunión de planeación — al terminar sabrás qué estamos construyendo, por qué, con qué tecnologías y cómo trabajaremos juntos. Tiempo de lectura: ~15 minutos.

---

## 1. ¿Qué es EduLogic?

### El problema

Para el año 2050 la mayoría de los empleos estarán relacionados con ciencia, tecnología, ingeniería y matemáticas (STEM). Sin embargo, en Colombia la mayoría de los estudiantes no desarrolla competencias sólidas en estas áreas, y el interés por formarse en ellas sigue siendo limitado. Muchos le tienen miedo a las matemáticas y a la programación porque intentaron aprender sin una guía adecuada y se frustraron.

### Nuestra solución

**EduLogic** es una plataforma web de aprendizaje que ayuda a estudiantes y aspirantes a desarrollar desde cero conocimientos en **lógica, matemáticas y programación**. Sus tres promesas:

1. **Aprende sin bases previas** — cursos con lecciones que guían paso a paso desde el nivel más básico.
2. **Evaluación con ayuda inmediata** — al terminar un cuestionario, el sistema lo corrige al instante y **explica los errores**: no solo te dice que fallaste, te dice por qué.
3. **Exploración sin límites** — el usuario navega libremente entre cursos según sus intereses.

### ¿Quiénes usan la plataforma? (3 roles)

| Rol | Qué puede hacer |
|---|---|
| **Estudiante** | Registrarse, explorar cursos, estudiar lecciones, presentar cuestionarios, recibir retroalimentación y ver su progreso |
| **Profesor** | Crear y administrar cursos, lecciones, cuestionarios y preguntas |
| **Administrador** | Gestionar los usuarios de la plataforma y supervisar el contenido |

---

## 2. La meta: qué debemos entregar y cuándo

Este es nuestro **Proyecto Integrador** de Riwi. Dura **5 semanas** y al final se evalúa con una **sustentación grupal + una evaluación individual** donde CADA integrante debe poder explicar el proyecto y su participación.

### Cronograma

| Semanas | Fase | Qué pasa |
|---|---|---|
| **1** | Planeación y diseño | Historias de usuario, mockups, modelo de datos, arquitectura, planeación Scrum |
| **2 y 3** | Desarrollo | Construcción del backend, frontend y base de datos + pruebas |
| **4 y 5** | Integración y sustentación | Corrección de errores, documentación, despliegue, pitches y sustentación |

### Entregables obligatorios

1. **Repositorio en GitHub** con README e instrucciones de instalación.
2. **Documento técnico** (se construye durante todo el proyecto, no al final).
3. **Mockups** (diseños de las pantallas en Figma).
4. **Pitch comercial**: 10 minutos, **en inglés**, SIN tecnicismos — vender el producto.
5. **Pitch técnico**: 20 minutos, en español — explicar las decisiones técnicas.
6. **Aplicación funcionando en internet** antes de la sustentación.

### ⚠️ Lo que se evalúa de cada uno individualmente

- Commits, ramas y Pull Requests **propios** en GitHub (la ausencia de actividad individual baja la nota).
- Poder **explicar el código y las decisiones** — no solo lo que cada quien hizo, sino entender el proyecto completo.
- Habilidades de comunicación, trabajo en equipo y profesionalismo.

---

## 3. El equipo y los roles

| Integrante | Rol |
|---|---|
| Dylan Alberto Suarez Laverde | Scrum Master / Líder + Backend Developer |
| Harold Ernesto Aristizabal Marinez | Product Owner + Backend Developer |
| Axel David Ruiz Poll | Frontend Developer |
| Samuel Roncancio Bertel | Frontend Developer |
| Mateo Hernandez Mendoza | Base de Datos |
| Yuranys Castro Ruiz | Base de Datos |

Qué hace cada rol:

| Rol | Responsabilidad principal |
|---|---|
| **Scrum Master / Líder** | Coordina, facilita reuniones, destraba impedimentos, cuida el cronograma |
| **Product Owner** | Prioriza funcionalidades, gestiona el backlog, valida entregables |
| **Backend Developers** | API, lógica de negocio, base de datos |
| **Frontend Developers** | Interfaces, experiencia de usuario, consumo de la API |

> Los roles orientan el trabajo pero NO son cajas cerradas: todos deben entender la solución completa y todos deben registrar actividad en Git.

### 📢 Canal oficial de comunicación

Toda la comunicación del equipo pasa por nuestro canal de **Discord**: [canal del equipo EduLogic](https://discordapp.com/channels/1519148873506099260/1519148874160144396). Ahí se comparten avances, dudas, impedimentos y los datos sensibles que NUNCA van al repositorio (como la cadena de conexión de la base de datos).

---

## 4. Tecnologías que usaremos (y por qué)

| Capa | Tecnología | Por qué la elegimos |
|---|---|---|
| **Frontend** | HTML5 + **Tailwind CSS** + **JavaScript Vanilla** (SPA) | El proyecto prohíbe frameworks (React, Vue...). Tailwind acelera los estilos y JS puro demuestra dominio de los fundamentos |
| **Backend** | **Python + FastAPI** | Framework moderno de APIs: valida datos automáticamente y genera documentación interactiva (`/docs`) donde probaremos todo |
| **ORM** | **SQLAlchemy** | Nos deja trabajar las tablas como clases de Python, con control total de las consultas |
| **Base de datos** | **PostgreSQL** alojado en **Supabase** | Relacional (el proyecto exige modelo normalizado 3FN). Supabase nos da un Postgres gratuito en la nube que TODOS compartimos, con panel visual para ver las tablas |
| **Despliegue** | **Render** (API) + **Vercel** (frontend) | Planes gratuitos, conectados a GitHub |
| **Gestión** | **GitHub Projects** | Tablero oficial del proyecto: si no está en el tablero, no existe |

### ¿Cómo se conecta todo? (arquitectura en 30 segundos)

```
[Navegador]  ──HTTP──►  [Frontend SPA]  ──fetch──►  [API FastAPI]  ──SQLAlchemy──►  [PostgreSQL]
  el usuario              Vercel                      Render                          Supabase
```

Ejemplo real: el estudiante envía un cuestionario → el frontend hace `POST /intentos` con las respuestas → FastAPI las califica contra la base de datos, guarda el intento y responde la nota con la explicación de cada error → el frontend la muestra al instante.

---

## 5. Cómo trabajamos: Scrum

Usamos **Scrum** (obligatorio en el proyecto). Lo esencial:

- **Product Backlog**: la lista priorizada de TODO el trabajo. Ya existe: son las **issues** del repositorio (44), cada una superdetallada con contexto, pasos y criterios de aceptación. **Lee tu issue completa antes de empezarla.**
- **Sprint**: período corto (1 semana para nosotros) con un compromiso claro de qué se entrega.
- **Tablero**: [GitHub Projects — EduLogic](https://github.com/users/DylanSrz/projects/6). Columnas: `Todo` → `In Progress` → `Done`. **Cada quien mueve sus propias tarjetas.**
- **Daily**: reunión corta (máx. 15 min) para sincronizar: qué hice, qué haré, qué me bloquea. **Horario acordado por el equipo: 6:00 am por Discord.**
- **Actas**: toda reunión genera un acta usando la plantilla `docs/actas/PLANTILLA-acta.md` (es evidencia obligatoria del proyecto).
- **Impedimentos**: ¿algo no te deja avanzar más de unas horas? Repórtalo al Scrum Master — pedir ayuda a tiempo es profesionalismo, no debilidad.

---

## 6. Cómo trabajamos: Git y GitHub (léelo dos veces)

Usamos **GitFlow**. Las reglas:

### Las ramas

- `main` → producción. Solo recibe merges desde `dev` al cierre de cada semana/sprint. **Protegida: nadie puede hacer push directo.**
- `dev` → integración. Aquí entra el trabajo de todos. **También protegida.**
- `feature/nombre-corto` → una rama por tarea (ej: `feature/crud-cursos`). Nacen de `dev` y mueren al mergearse.
- `fix/nombre-corto` → correcciones de errores.

### El ciclo de trabajo de CADA tarea

```bash
# 1. Ubícate en dev y trae lo último
git checkout dev
git pull origin dev

# 2. Crea tu rama para la tarea
git checkout -b feature/mi-tarea

# 3. Trabaja con commits pequeños y frecuentes
git add .
git commit -m "feat: descripcion clara de lo que hice"

# 4. Sube tu rama
git push -u origin feature/mi-tarea

# 5. Abre un Pull Request hacia dev en GitHub
#    (la plantilla se carga sola — llénala completa)

# 6. Un compañero revisa y aprueba → merge → la rama se borra automáticamente
```

### Mensajes de commit

Formato: `tipo: descripción en presente`. Tipos: `feat` (funcionalidad), `fix` (corrección), `docs` (documentación), `style` (estilos), `refactor` (mejora interna), `chore` (configuración).

Ejemplos: ✅ `feat: agregar endpoint de registro de usuarios` — ❌ `cambios`, `arreglos varios`, `ya quedo`.

### Reglas de oro

1. **Nunca** trabajes directo sobre `dev` o `main` (además, el push te será rechazado — no es un error, es la protección).
2. Todo PR necesita la **aprobación de un compañero**. Revisar el código de otros es parte del trabajo de todos.
3. Toda tarea nace de una **issue** del tablero; el PR la referencia con `Closes #N`.
4. **NUNCA subas credenciales**: archivos `.env`, contraseñas o cadenas de conexión. El `.gitignore` ayuda, pero la responsabilidad es tuya.
5. Commits pequeños y frecuentes — no un commit gigante al final del día.

---

## 7. Estructura del repositorio

```
EduLogic/
├── .github/          # Plantilla de Pull Request
├── backend/          # API con FastAPI (Python)
├── frontend/         # SPA: HTML, Tailwind, JavaScript Vanilla
├── database/         # Modelo de datos, scripts SQL, datos semilla
├── docs/             # Documento técnico, mockups, actas, evidencias
│   ├── actas/        #   ← plantilla y actas de reuniones
│   ├── mockups/
│   ├── arquitectura/
│   └── pruebas/
└── README.md
```

Cada carpeta tiene (o tendrá) su propio README con instrucciones para levantar esa parte del proyecto.

---

## 8. Herramientas que debes tener instaladas

Instálalas esta semana, no cuando las necesites con afán:

| Herramienta | Para qué | Enlace |
|---|---|---|
| **Git** | Control de versiones | https://git-scm.com/downloads |
| **Python 3.11+** | El backend | https://www.python.org/downloads/ (en Windows, marca "Add Python to PATH" al instalar) |
| **Node.js LTS** | Compilar Tailwind CSS | https://nodejs.org |
| **Visual Studio Code** | Editor del equipo | https://code.visualstudio.com |
| Extensión **Live Server** (VS Code) | Servir el frontend en local | Buscarla en la pestaña de extensiones |
| Cuenta de **GitHub** | Repositorio y tablero | https://github.com (con foto y nombre real — los evaluadores la verán) |
| Cuenta de **Figma** | Ver y editar los mockups | https://figma.com |

Verifica que todo quedó bien: `git --version`, `python --version` y `node --version` deben responder en tu terminal.

---

## 9. Tus primeros pasos (checklist de onboarding)

- [ ] 1. Únete al [canal de Discord del equipo](https://discordapp.com/channels/1519148873506099260/1519148874160144396) y acepta la invitación al repositorio (te llegó al correo de tu cuenta de GitHub).
- [ ] 2. Lee esta guía completa. ✅ (ya casi)
- [ ] 3. Clona el repositorio: `git clone https://github.com/DylanSrz/EduLogic.git`
- [ ] 4. Entra al [tablero del proyecto](https://github.com/users/DylanSrz/projects/6) y explora las issues — en especial las de la **Semana 1** (#1 a #9).
- [ ] 5. Lee la plantilla de PR (`.github/PULL_REQUEST_TEMPLATE.md`) y la de actas (`docs/actas/PLANTILLA-acta.md`).
- [ ] 6. Asiste a la reunión de planeación del Sprint 1 — ahí se asignan las tareas.
- [ ] 7. Cuando tengas tu primera issue asignada: léela completa (contexto, pasos, criterios de aceptación, recursos) y sigue el ciclo de Git de la sección 6.

## 10. Acuerdos de convivencia

- La comunicación del equipo es constante y respetuosa; los desacuerdos técnicos se resuelven con argumentos (y quedan en las actas).
- Si no vas a llegar a un compromiso, avisa ANTES de la fecha, no después.
- Ninguna pregunta es tonta: todos estamos aprendiendo. Pregunta en el canal de Discord, no en privado — la respuesta seguro le sirve a alguien más.
- La meta es de todos: no existe "mi parte quedó bien y lo demás no es mi problema". En la sustentación individual te pueden preguntar por CUALQUIER módulo.

---

## 11. Glosario básico

Términos que escucharás todo el proyecto. Si alguno no te suena, pregúntalo sin pena:

| Término | Qué significa |
|---|---|
| **MVP** | Producto Mínimo Viable: la versión más pequeña del producto que ya funciona y aporta valor. Nuestro compromiso de entrega |
| **API / API REST** | La "puerta" del backend: el frontend le pide datos y acciones mediante peticiones HTTP y ella responde en JSON |
| **Endpoint** | Cada "ruta" concreta de la API. Ej: `POST /auth/login`, `GET /cursos` |
| **JSON** | El formato de texto en que la API y el frontend intercambian datos |
| **SPA** | Single Page Application: la web carga una sola página y JavaScript cambia el contenido al navegar, sin recargar |
| **ORM** | Herramienta (SQLAlchemy) que traduce entre clases de Python y tablas de la base de datos |
| **3FN** | Tercera Forma Normal: nivel de organización de la base de datos que evita datos repetidos e inconsistencias. El proyecto la exige |
| **JWT** | Token firmado que la API entrega al hacer login; el frontend lo envía en cada petición para demostrar quién es el usuario |
| **CRUD** | Create, Read, Update, Delete: las 4 operaciones básicas sobre un recurso |
| **Issue** | Tarjeta de trabajo en GitHub: describe una tarea con sus pasos y criterios. Nuestro backlog está hecho de issues |
| **PR (Pull Request)** | Solicitud de integrar tu rama a `dev`. Es donde el equipo revisa tu código antes de aceptarlo |
| **Merge** | Integrar una rama en otra (lo que pasa cuando aprueban tu PR) |
| **Sprint** | Período corto de trabajo (1 semana) con un compromiso de entrega claro |
| **Daily** | Reunión diaria de máximo 15 minutos para sincronizar el equipo |
| **Deploy / despliegue** | Publicar la aplicación en internet (Render y Vercel) |

---

**¿Dudas después de leer?** Tráelas a la próxima reunión o escríbelas en el [canal de Discord](https://discordapp.com/channels/1519148873506099260/1519148874160144396). ¡Bienvenido a EduLogic! 💪
