# 📋 Acta de Reunión — EduLogic

## 🗓️ Información general

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-07-15 |
| **Hora inicio / fin** | 09:00 am — 10:20 am |
| **Tipo de reunión** | Planeación de Sprint (Sprint 4) |
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

1. Validación de la entrega funcional de lo trabajado en la sprint 3
2. Mini-retrospectiva.
3. Arrastre de pendientes y planeación del Sprint 4.


## 💬 Desarrollo de la reunión

### 1. validacion del  Sprint 3 — demostración

Se demostró en vivo lo construido durante el sprint 3: Se ejecutó con éxito la demostración funcional de la arquitectura base y el sistema de seguridad del proyecto EduLogic, liderada por Harold Aristizábal y Dylan Suarez. Durante la sesión, se validó la operatividad del primer CRUD completo (entidad Cursos) desarrollado con FastAPI y SQLAlchemy, el cual quedó establecido como el estándar técnico a replicar en los módulos de lecciones y cuestionarios. Asimismo, se comprobó la integración del sistema de autenticación y autorización mediante JWT, garantizando la protección de los endpoints y el correcto flujo de control de acceso según los roles del sistema (Estudiante, Profesor y Administrador).

### 2. Mini-retrospectiva

Debido a las discrepancias de integración detectadas entre el backend y el frontend, el ritmo de desarrollo ha experimentado una desaceleración temporal, afectando el cronograma de entregas planificado para el equipo de frontend.

### 3 arrastre de pendientes y planeacion del sprint 4 

Se llevará a cabo la gestión del remanente técnico, priorizando el traspaso de las tareas inconclusas del frontend hacia el Sprint 4. De esta manera, los esfuerzos iniciales del equipo se enfocarán en la resolución definitiva de las discrepancias de integración con el backend antes de abordar nuevos desarrollos; paralelamente, se avanzará de forma anticipada con las tareas programadas para el backend."

## ✅ Decisiones tomadas

| # | Decisión | Justificación |
|---|---|---|
| 1 | Traspaso prioritario del remanente de frontend al Sprint 4 | Resolver fallas de integración con el backend antes de nuevos desarrollos |
| 2 | Adelantamiento en paralelo de tareas en el backend | Optimizar los tiempos de entrega del próximo ciclo |

## 📝 Compromisos y tareas

| Compromiso | Responsable | Issue relacionada | Fecha límite |
|---|---|---|---|
| [Backend] Gestión de cuestionarios, preguntas y opciones | Dylan Suárez | #18 | 2026-07-15 |
| [Frontend] Router SPA con hash routing | Samuel | #25 | 2026-07-15 |
| [Pruebas] Diseñar los casos de prueba del MVP | Mateo y Yuranys | #36 | 2026-07-15 |
| [Frontend] Vistas de registro e inicio de sesión con validaciones | Samuel | #27 | 2026-07-15 |
| [Frontend] Módulo central de conexión con la API | Axel | #26 | 2026-07-15 |
| [Backend] CRUD de lecciones ordenadas por curso | Harold | #17 | 2026-07-15 |
| [Frontend] Vista del catálogo de cursos | Axel | #28 | 2026-07-15 |

## 🚧 Impedimentos reportados

| Impedimento | Reportado por | Acción acordada |
|---|---|---|
| Inconsistencias de integración entre el backend y frontend | Equipo de Frontend | Traspasar el remanente al Sprint 4 y congelar nuevos desarrollos de interfaz hasta resolver las discrepancias. |
| Ralentización del ritmo de desarrollo en el frontend | Equipo de Desarrollo | Adelantar tareas en paralelo del backend para optimizar tiempos mientras se estabilizan los contratos de la API. |

## 📅 Próxima reunión

| Campo | Detalle |
|---|---|
| **Fecha y hora** | 2026-07-16, 9:00 am (Discord) |
| **Tema principal** | Cierre del Sprint 4 y planeación del Sprint 5 |