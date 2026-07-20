# 📘 Documento Técnico — EduLogic

> **Documento vivo:** se actualiza durante todo el proyecto. Responsable de mantenerlo: **Harold Ernesto Aristizabal Martinez (Product Owner)**. Regla del equipo: al cerrar una issue grande (modelo, despliegue, pruebas), se actualiza la sección correspondiente esa misma semana.
>
> Estado de las secciones: ✅ completa · 🔄 en construcción · ⏳ Pendiente

---

## 1. Nombre del proyecto ✅

**EduLogic** — plataforma web de aprendizaje STEM con retroalimentación inmediata.

## 2. Problema identificado ✅

Según el informe *Education at a Glance 2023* de la OCDE, la formación en ciencia, tecnología, ingeniería y matemáticas (STEM) es un factor clave para el desarrollo económico, y se proyecta que para 2050 la mayoría de los empleos estarán relacionados con estas áreas. Sin embargo, en Colombia la mayoría de los estudiantes no desarrolla competencias sólidas en STEM y el interés por formarse en estas disciplinas sigue siendo limitado.

A esto se suma un problema de experiencia: quien intenta aprender lógica, matemáticas o programación por su cuenta suele enfrentarse a materiales que asumen conocimientos previos y a evaluaciones que solo indican el error sin explicarlo, lo que produce frustración y abandono.

## 3. Objetivo general ✅

Desarrollar una plataforma web funcional que permita a estudiantes y aspirantes desarrollar desde cero competencias en lógica, matemáticas y programación, mediante cursos con lecciones progresivas y cuestionarios con corrección automática y retroalimentación inmediata.

## 4. Objetivos específicos ✅

1. Implementar un catálogo de cursos con lecciones ordenadas progresivamente, navegable libremente según los intereses del usuario.
2. Desarrollar un motor de evaluación que califique los cuestionarios al instante y explique el porqué de cada error (retroalimentación pedagógica).
3. Implementar el seguimiento del progreso del estudiante (lecciones completadas y desempeño en cuestionarios).
4. Gestionar tres roles con permisos diferenciados: estudiante, profesor y administrador, con autenticación segura (JWT y contraseñas hasheadas).
5. Garantizar la persistencia de la información en una base de datos relacional normalizada hasta 3FN.
6. Desplegar la aplicación en la nube con disponibilidad pública.

## 5. Alcance ✅

**El MVP SÍ incluye:**

- Registro e inicio de sesión con roles (estudiante, profesor, administrador).
- Catálogo público de cursos; lecciones ordenadas con contenido de estudio.
- Cuestionarios de selección múltiple con corrección automática, puntaje y explicación de cada error, con reintentos ilimitados.
- Progreso del estudiante por curso (lecciones completadas, mejor puntaje).
- Panel del profesor (gestión de cursos, lecciones, cuestionarios y preguntas) y panel del administrador (gestión de usuarios).
- Diseño responsive y navegación SPA.

**Queda explícitamente FUERA del MVP:**

- Contenido multimedia (video/audio) en las lecciones.
- Certificados, gamificación (insignias, rankings) y foros/comentarios.
- Recuperación de contraseña por correo y verificación de email.
- Aplicación móvil nativa y modo sin conexión.
- Pagos o suscripciones.

*(La priorización fina del alcance está en las historias de usuario: 🔴 imprescindible / 🟡 importante / 🟢 deseable.)*

## 6. Historias de usuario ✅

Ver **[docs/historias-de-usuario.md](historias-de-usuario.md)**: 18 historias que cubren los 4 roles (visitante, estudiante, profesor y administrador), con criterios de aceptación (formato Gherkin en las historias críticas HU-06 y HU-07), priorización y agrupación en épicas (E1-E5).

## 7. Arquitectura de la solución ✅

Ver **[docs/arquitectura/arquitectura.md](arquitectura/arquitectura.md)**: arquitectura de tres capas desacopladas — SPA (HTML5 + Tailwind + JS Vanilla, en Vercel) → API REST (FastAPI + SQLAlchemy, en Render) → PostgreSQL (Supabase) — con el diagrama general, la estructura interna del backend, el diagrama de secuencia del flujo de evaluación y el manejo de configuración por entornos.

## 8. Modelo de datos ✅

Ver **[database/modelo/](../database/modelo/README.md)**: diagrama entidad-relación ([diagrama-er.png](../database/modelo/diagrama-er.png), fuente editable en `modelo.dbml`), descripción de las 9 tablas con sus reglas, cardinalidades, la explicación de la normalización hasta **3FN** con ejemplos del propio modelo, y las decisiones de diseño (borrado lógico de usuarios, relación 1:1 lección-cuestionario, borrado en cascada de la cadena de contenido, restricciones únicas compuestas que blindan las reglas de negocio en la base).

## 9. Justificación tecnológica ✅

Resumen (la versión completa, con alternativas consideradas, está en la sección 4 de [arquitectura.md](arquitectura/arquitectura.md)):

| Tecnología | Justificación |
|---|---|
| **Python + FastAPI** | Validación automática de datos (Pydantic), documentación interactiva incluida (`/docs`) y alineado con la formación del equipo |
| **SQLAlchemy** | ORM con control total de consultas y manejo de transacciones |
| **PostgreSQL (Supabase)** | Base relacional con integridad referencial para el modelo 3FN; Supabase ofrece plan gratuito estable, instancia compartida por el equipo y panel de administración visual |
| **HTML5 + Tailwind + JS Vanilla (SPA)** | Cumple la restricción de no usar frameworks demostrando dominio de fundamentos; Tailwind acelera el diseño responsive |
| **Render + Vercel** | Despliegue gratuito de la API y del sitio estático, con integración directa a GitHub |
| **GitHub + GitHub Projects** | Control de versiones con GitFlow y tablero Scrum con trazabilidad issue → rama → PR |

## 10. MVP definido ✅

El compromiso de entrega para la sustentación son las historias con prioridad 🔴 (ver historias de usuario): registro/login con roles, catálogo y consumo de cursos y lecciones, cuestionarios con corrección y retroalimentación inmediata (el diferencial del producto), gestión de contenido por el profesor y gestión de usuarios por el administrador — todo desplegado y funcional en la nube.

La evaluación del MVP prioriza funcionalidad, estabilidad y valor para el usuario sobre cantidad de funcionalidades.

## 11. Evidencias Scrum ✅

Herramienta oficial: **GitHub Projects** — [tablero EduLogic](https://github.com/users/DylanSrz/projects/6). El backlog inicial fue de 44 issues (173 puntos estimados) y creció durante el desarrollo hasta **52 issues** con etiquetas, milestone, épica y story points — **182 puntos completados** al cierre (la diferencia refleja las issues que surgieron sobre la marcha: mejoras, correcciones y el rediseño visual, todas trazadas en el tablero).

| Evidencia | Ubicación |
|---|---|
| Product Backlog priorizado | Tablero de GitHub Projects |
| Sprint Backlog | Vista del tablero filtrada por el sprint en curso |
| Historias de usuario | [docs/historias-de-usuario.md](historias-de-usuario.md) |
| Actas de reuniones | [docs/actas/](actas/) (planeaciones de los sprints 1-6 y reunión de la fase final) |
| Estimación y velocidad | Story points en el tablero + [guía de planning poker](guia-planning-poker.md) |
| Trazabilidad Git | PRs enlazados a issues (`Closes #N`), ramas `feature/`/`fix/`, GitFlow con `main`/`dev` protegidas |

Las capturas del tablero y de la actividad de Git están en [docs/evidencias/](evidencias/).

### Registro de sprints

El equipo trabajó con **sprints diarios** (adaptación de Scrum al calendario comprimido del proyecto: cada día tuvo planeación, ejecución y cierre, con daily a las 6:00 am por Discord).

| Sprint | Fecha | Objetivo | Puntos |
|---|---|---|---|
| 1 | 2026-07-12 | Planeación y diseño: estructura del repo, historias de usuario, modelo de datos, mockups | 30 |
| 2 | 2026-07-13 | Fundaciones: FastAPI + conexión a Supabase, modelos SQLAlchemy, estructura de la SPA | 22 |
| 3 | 2026-07-14 | Autenticación JWT con roles, CRUD de cursos, capa de consumo de API en el frontend | 28 |
| 4 | 2026-07-15 | CRUD de lecciones y cuestionarios, vistas de registro/login y catálogo, CORS | 34 |
| 5 | 2026-07-16 | Motor de evaluación, progreso del estudiante, manejo global de errores, vistas del flujo del estudiante | 26 |
| 6 | 2026-07-17 | Paneles de profesor y administrador, protección de rutas, release v0.2.0 | 18 |
| Fase final | 2026-07-18 → | Rediseño visual, responsive, despliegue en producción (v0.3.0 y v0.4.0), pruebas y documentación | 24 |

**Releases publicados:** v0.1.0 (primer MVP navegable) → v0.2.0 (backend completo + frontend integrado) → v0.3.0 (frontend 3 roles + identidad visual + responsive) → v0.4.0 (aplicación en producción con dominio propio).

## 12. Evidencias de pruebas 🔄

- **Matriz de casos de prueba** ✅: [docs/pruebas/casos-de-prueba.md](pruebas/casos-de-prueba.md) — casos por módulo (autenticación, contenido, evaluación, progreso, administración) con precondiciones, pasos y resultado esperado.
- **Ejecución y registro de errores** 🔄: en curso (issue #37) — resultado de cada caso sobre la versión desplegada, errores encontrados y su corrección trazada (issue → rama `fix/` → PR).

## 13. Despliegue ✅

La aplicación está en producción con dominio propio y HTTPS:

| Componente | URL | Plataforma |
|---|---|---|
| **Aplicación web** | [https://edulogic.pro](https://edulogic.pro) (y `www.edulogic.pro`) | Vercel (sitio estático; Tailwind se compila en cada deploy) |
| **API REST** | [https://api.edulogic.pro](https://api.edulogic.pro) — documentación interactiva en [/docs](https://api.edulogic.pro/docs) | Render (Web Service, uvicorn) |
| **Base de datos** | PostgreSQL gestionado | Supabase (conexión vía Session Pooler, IPv4) |

**Proceso de despliegue (despliegue continuo):** ambas plataformas están conectadas al repositorio y despliegan automáticamente la rama `main` — publicar un release (merge `dev` → `main` + tag) actualiza producción sin pasos manuales. La configuración sensible (`DATABASE_URL`, `SECRET_KEY`) vive únicamente en las variables de entorno de cada plataforma, nunca en el repositorio; el frontend selecciona la URL del backend según el entorno (localhost en desarrollo, `api.edulogic.pro` en producción).

**DNS:** dominio `edulogic.pro` gestionado en Hostinger — registro A del apex y CNAME `www` hacia Vercel, CNAME `api` hacia Render; certificados TLS emitidos automáticamente por cada plataforma.

**Usuarios de prueba:** existe un usuario semilla por cada rol (estudiante, profesor, administrador); sus credenciales se comparten por el canal privado del equipo, no en este documento.

**Nota operativa:** el plan gratuito de Render suspende la API tras ~15 minutos de inactividad; la primera petición posterior tarda ~50 segundos (arranque en frío). Para demos, visitar antes `https://api.edulogic.pro/health`.
