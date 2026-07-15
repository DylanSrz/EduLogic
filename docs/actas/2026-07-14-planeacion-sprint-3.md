# 📋 Acta de Reunión — EduLogic

## 🗓️ Información general

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-07-14 |
| **Hora inicio / fin** | 10:00 am — 10:54 am |
| **Tipo de reunión** | Planeación de Sprint (Sprint 3) |
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

1. Cierre del Sprint 2: demostración funcional de lo construido.
2. Registro de la velocidad del Sprint 2.
3. Mini-retrospectiva.
4. Arrastre de pendientes y planeación del Sprint 3.

## 💬 Desarrollo de la reunión

### 1. Cierre del Sprint 2 — demostración

Se demostró en vivo lo construido durante el sprint:

- **Backend (Dylan)**: API FastAPI corriendo en local con documentación interactiva (`/docs`); endpoints `GET /health` y `GET /health/db` verificando la conexión a PostgreSQL en Supabase (#10, #11).
- **Modelos y tablas (Harold)**: las 9 tablas del modelo de datos creadas en Supabase mediante SQLAlchemy, verificadas en el Table Editor (#12).
- **Datos semilla (Mateo)**: Ejecucion del SQL de semillas - contenido y usuarios, pendiente hash de contraseñas.
- **Frontend (Axel y Samuel)**: Lograron avanzar con las issues del sprint pero no se logro su finalizacion por inconmvenientes menores, quedaron para finalizar el dia de hoy con compromiso antes del medio día.

**Velocidad del Sprint 2: 11 puntos** (confirmados en `Done`: #10 + #11 + #12 = 11 puntos).

### 2. Mini-retrospectiva

Mateo presento dificultad para hacer la documentacion de la issue que desarrollo durante el sprint 2, junto con el equipo le ofrecimos apoyo para enseñarle y se le dio orientadcion con documentacion al respecto.

Dylan presento incidente de entorno en Windows (PATH/VS Code), espera de correcciones en revisión de PR.

### 3. Alcance del Sprint 3

**Meta del sprint:** al final del día, una persona puede registrarse e iniciar sesión contra la API, y el frontend tiene su módulo de conexión listo para consumirla.

## ✅ Decisiones tomadas

| # | Decisión | Justificación |
|---|---|---|
| 1 | Las issues del Sprint 2 no terminadas se arrastran al Sprint 3 con el mismo responsable | Continuidad; no se re-planifica lo ya acordado |
| 2 | Los usuarios de los datos semilla (#13) se completan cuando exista la función de hashing del registro (#14) | Las contraseñas deben guardarse con hash bcrypt real, no inventado |

## 📝 Compromisos y tareas

| Compromiso | Responsable | Issue relacionada | Fecha límite |
|---|---|---|---|
| Registro de usuarios con contraseña hasheada | Dylan | #14 | 2026-07-14 |
| Login con JWT y control de acceso por roles | Dylan | #15 | 2026-07-14 |
| CRUD de cursos (empezar por endpoints públicos; los protegidos al integrar con #15) | Harold | #16 | 2026-07-14 |
| Módulo central de conexión con la API (`api.js`) | Axel | #26 | 2026-07-14 |
| Vistas de registro e inicio de sesión con validaciones | Samuel | #27 | 2026-07-14 |
| Diseñar los casos de prueba del MVP (desde las historias de usuario) | Mateo y Yuranys | #36 | 2026-07-14 |
| Completar usuarios de datos semilla (tras la #14) | Mateo | #13 | 2026-07-14 |

**Puntos comprometidos: ~22** (+ arrastre).

**Dependencias identificadas:** #15 requiere #14 (Dylan en cadena) → las vistas de #27 se conectan contra esos endpoints al final del día (Samuel maqueta y valida formularios mientras tanto) → #16 integra permisos cuando #15 esté en rama (trabajo en pareja Dylan-Harold en la tarde) → #26 puede probarse contra `/health` desde ya → los usuarios semilla de #13 esperan la función de hash de #14.

## 🚧 Impedimentos reportados

| Impedimento | Reportado por | Acción acordada |
|---|---|---|
| [N/A] | | |

## 📅 Próxima reunión

| Campo | Detalle |
|---|---|
| **Fecha y hora** | 2026-07-15, 9:00 am (Discord) |
| **Tema principal** | Cierre del Sprint 3 y planeación del Sprint 4 |