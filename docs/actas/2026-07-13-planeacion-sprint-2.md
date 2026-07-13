# 📋 Acta de Reunión — EduLogic

## 🗓️ Información general

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-07-13 |
| **Hora inicio / fin** | 6:00 am — 7:20 am |
| **Tipo de reunión** | Planeación de Sprint (Sprint 2) + mini-retrospectiva del Sprint 1 |
| **Modalidad** | Virtual (Discord) |
| **Moderador** | Dylan Alberto Suarez Laverde |
| **Encargado del acta** | Harold Ernesto Aristizabal Martinez |

## 👥 Asistencia

| Integrante | Rol | Asistió |
|---|---|---|
| Dylan Alberto Suarez Laverde | Scrum Master / Backend | ✅ |
| Harold Ernesto Aristizabal Martinez | Product Owner / Backend | ✅ |
| Axel David Ruiz Poll | Frontend | ✅ |
| Samuel Roncancio Bertel | Frontend | ✅ |
| Mateo Hernandez Mendoza | Base de Datos | ✅ |
| Yuranys Castro Ruiz | Base de Datos | ✅ |

## 📌 Agenda propuesta

1. Mini-retrospectiva del Sprint 1 y registro de velocidad.
2. Ajuste de cadencia: sprints de 1 día por restricción de tiempo del proyecto.
3. Definición del alcance del Sprint 2 (inicio del desarrollo).
4. Acuerdos operativos para sprints diarios.

## 💬 Desarrollo de la reunión

### 1. Cierre del Sprint 1

Se completaron las 9 issues de planeación y diseño (#1 a #9): historias de usuario, Product Backlog, mockups, modelo de datos en 3FN, arquitectura, proyecto Supabase, estructura del repositorio, documento técnico y normas de Git con el ejercicio de iniciación del equipo. **Velocidad del Sprint 1: 30 puntos.**

Retrospectiva breve: El desarrollo se vio frenado por la desalineación en los horarios del equipo, lo que provocó esperas y bloqueos en las integraciones; por ello, se acordó establecer una ventana de disponibilidad diaria común para resolver dudas en tiempo real y coordinar dependencias críticas.

### 2. Nueva cadencia

Por la restricción de tiempo del cronograma, el equipo trabajará con **sprints de 1 día**: la reunión de las 6:00 am funciona como cierre del sprint anterior y planeación del día. Los milestones del repositorio se mantienen como mapa general del cronograma oficial.

### 3. Alcance del Sprint 2

**Meta del sprint:** al final del día, el backend corre en local conectado a Supabase con las tablas creadas, y el frontend base tiene navegación SPA funcionando.

## ✅ Decisiones tomadas

| # | Decisión | Justificación |
|---|---|---|
| 1 | Sprints de 1 día, planeados en la reunión diaria de las 6:00 am | Restricción de tiempo del proyecto; un solo ritual diario en lugar de dos |
| 2 | SLA de revisión de Pull Requests: máximo 2 horas | Con sprints diarios, un PR esperando revisión bloquea el sprint completo; si el revisor no responde en 2 horas, cualquier otro integrante revisa |
| 3 | Trabajo en pareja (llamada) en los puntos de integración entre issues dependientes | Evita bloqueos entre tareas encadenadas |
| 4 | Checkpoint de mediodía por Discord (mensaje con % de avance, no reunión) | Detectar a tiempo tareas en riesgo y reasignar o recortar en el momento |
| 5 | [completar si hubo más decisiones] | |

## 📝 Compromisos y tareas

| Compromiso | Responsable | Issue relacionada | Fecha límite |
|---|---|---|---|
| Estructura base del proyecto FastAPI | Dylan | #10 | 2026-07-13 |
| Conexión de FastAPI a PostgreSQL (Supabase) con SQLAlchemy | Dylan | #11 | 2026-07-13 |
| Modelos SQLAlchemy y creación de tablas | Harold (con apoyo de Yuranys) | #12 | 2026-07-13 |
| Datos semilla (SQL desde el modelo, en paralelo) | Mateo y Yuranys | #13 | 2026-07-13 |
| Estructura base del frontend con Tailwind | Axel | #24 | 2026-07-13 |
| Router SPA con hash routing | Samuel | #25 | 2026-07-13 |
| *(Stretch si el día alcanza)* Módulo central de conexión con la API | Axel | #26 | 2026-07-13 |

**Puntos comprometidos: 22** (25 con el stretch).

**Dependencias identificadas:** #11 requiere #10 (Dylan trabaja en cadena) → #12 requiere #11 (Harold coordina con Dylan a mediodía) → #13 se ejecuta contra las tablas de #12 (Mateo escribe el SQL en paralelo desde `database/modelo/modelo.dbml`). #25 requiere #24 (Samuel maqueta vistas de prueba mientras tanto).

## 🚧 Impedimentos reportados

| Impedimento | Reportado por | Acción acordada |
|---|---|---|
| N/A | | |

## 📅 Próxima reunión

| Campo | Detalle |
|---|---|
| **Fecha y hora** | 2026-07-14, 10:00 am (Discord) |
| **Tema principal** | Cierre del Sprint 2 y planeación del Sprint 3 |
