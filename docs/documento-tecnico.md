# 📘 Documento Técnico — EduLogic

> **Documento vivo:** se actualiza durante todo el proyecto. Responsable de mantenerlo: **Harold Ernesto Aristizabal Martinez (Product Owner)**. Regla del equipo: al cerrar una issue grande (modelo, despliegue, pruebas), se actualiza la sección correspondiente esa misma semana.
>
> Estado de las secciones: ✅ completa · 🔄 en construcción · ⏳ pendiente

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

## 8. Modelo de datos ⏳

*Pendiente — se completa con la issue #4 (responsable: Yuranys).* Incluirá: diagrama entidad-relación, descripción de cada tabla y la explicación de la normalización hasta 3FN con ejemplos del propio modelo. Se enlazará desde `database/modelo/`.

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

## 11. Evidencias Scrum 🔄

Herramienta oficial: **GitHub Projects** — [tablero EduLogic](https://github.com/users/DylanSrz/projects/6) (44 issues con etiquetas, milestone, épica y story points; total estimado: 173 puntos).

| Evidencia | Ubicación |
|---|---|
| Product Backlog priorizado | Tablero de GitHub Projects |
| Sprint Backlog | Vista del tablero filtrada por el sprint en curso |
| Historias de usuario | [docs/historias-de-usuario.md](historias-de-usuario.md) |
| Actas de reuniones | [docs/actas/](actas/) (planeación Sprint 1: 2026-07-12) |
| Estimación y velocidad | Story points en el tablero + [guía de planning poker](guia-planning-poker.md) |
| Trazabilidad Git | PRs enlazados a issues (`Closes #N`), ramas `feature/`/`fix/`, GitFlow con `main`/`dev` protegidas |

*Al cierre de cada sprint se agregan aquí: captura del tablero, puntos completados (velocidad) y acta de la revisión.*

### Registro de sprints

| Sprint | Semana | Objetivo | Puntos completados |
|---|---|---|---|
| 1 | 2026-07-12 → 2026-07-19 | Planeación y diseño (issues #1-#9) | *en curso* |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

## 12. Evidencias de pruebas ⏳

*Pendiente — se completa en las semanas 2-3 con las issues #36 y #37:* matriz de casos de prueba, ejecución con evidencias, registro de errores encontrados y sus correcciones (issues `fix/` enlazadas a PRs). Se enlazará desde `docs/pruebas/`.

## 13. Despliegue ⏳

*Pendiente — se completa en la semana 4 con las issues #38 y #39:* URLs públicas de la aplicación y la API, proceso de despliegue y usuarios de prueba por rol.
