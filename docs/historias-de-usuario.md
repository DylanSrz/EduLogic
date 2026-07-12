# 📖 Historias de Usuario — EduLogic

> **Cómo leer este documento:** cada historia sigue el formato estándar *"Como [rol], quiero [acción], para [beneficio]"*, tiene criterios de aceptación (condiciones concretas para considerarla terminada) y una prioridad:
>
> - 🔴 **Imprescindible** — sin esto no hay MVP; se entrega sí o sí.
> - 🟡 **Importante** — hace parte del MVP completo; se entrega salvo crisis de tiempo.
> - 🟢 **Deseable** — mejora la experiencia; se hace solo si el tiempo alcanza.
>
> Los roles del sistema son: **Visitante** (sin cuenta), **Estudiante**, **Profesor** y **Administrador**.
>
> **Nota metodológica:** los criterios de aceptación de las historias críticas del producto (HU-06 y HU-07, el flujo de evaluación con retroalimentación) están escritos en formato **Gherkin** (*Dado / Cuando / Entonces*), el estándar de BDD, por ser los flujos con más escenarios de comportamiento y la base directa de los casos de prueba. El resto usa condiciones simples por legibilidad, ya que mezclan comportamientos con reglas de negocio.

---

## 🗂️ Épicas

Las historias se agrupan en **épicas**: cuerpos de trabajo grandes con sentido de producto propio. Permiten comunicar el avance a alto nivel ("E1 completa, E3 al 60%") y organizan el tablero del proyecto.

| Épica | Nombre | Historias | Qué entrega |
|---|---|---|---|
| **E1** | Cuentas y accesos | HU-02, HU-03, HU-15, HU-16, HU-17 | Registro, login, roles y administración de usuarios |
| **E2** | Contenido de aprendizaje | HU-01, HU-04, HU-05, HU-09, HU-11, HU-12, HU-14, HU-18 | Catálogo, cursos, lecciones y panel del profesor |
| **E3** | Evaluación y retroalimentación | HU-06, HU-07, HU-10, HU-13 | El corazón del producto: quiz, corrección inmediata y explicaciones |
| **E4** | Progreso del estudiante | HU-08 | Seguimiento del avance |
| **E5** | Fundaciones y entrega | *(épica técnica, sin historias de usuario)* | Configuración, arquitectura, base de datos, calidad, despliegue y entregables del proyecto |

En el tablero de GitHub Projects, cada issue tiene el campo **"Épica"** con su grupo, y el campo **"Story Points"** donde el equipo registra la estimación acordada en el planning poker (escala Fibonacci: 1, 2, 3, 5, 8, 13). La suma de puntos completados por sprint es la **velocidad** del equipo.

---

## 👤 Visitante (sin cuenta)

### HU-01 — Explorar el catálogo de cursos 🔴

**Como** visitante, **quiero** ver el catálogo de cursos disponibles sin necesidad de registrarme, **para** conocer qué ofrece la plataforma antes de crear una cuenta.

**Criterios de aceptación:**
- El catálogo es accesible sin iniciar sesión y muestra título, descripción y nivel de cada curso.
- Al intentar abrir el contenido de una lección sin sesión, se invita a registrarse.
- Si no hay cursos, se muestra un mensaje claro (nunca una pantalla vacía).

### HU-02 — Registrarme en la plataforma 🔴

**Como** visitante, **quiero** crear una cuenta con mi nombre, correo y contraseña, **para** acceder a los cursos y guardar mi progreso.

**Criterios de aceptación:**
- El formulario valida: nombre (mínimo 3 caracteres), correo con formato válido y contraseña de mínimo 8 caracteres con confirmación.
- Si el correo ya está registrado, se informa con un mensaje claro.
- La contraseña se almacena de forma segura (hasheada, nunca en texto plano).
- Al registrarse exitosamente, se redirige al inicio de sesión con un mensaje de bienvenida.
- No es posible registrarse con el rol de administrador.

---

## 🎓 Estudiante

### HU-03 — Iniciar y cerrar sesión 🔴

**Como** estudiante, **quiero** iniciar sesión con mi correo y contraseña (y poder cerrarla), **para** acceder de forma segura a mi cuenta.

**Criterios de aceptación:**
- Con credenciales correctas, accedo y la interfaz muestra mi nombre.
- Con credenciales incorrectas, veo un mensaje genérico ("credenciales incorrectas") sin revelar cuál dato falló.
- Mi sesión expira tras el tiempo definido; al expirar, se me pide iniciar sesión de nuevo.
- Al cerrar sesión, vuelvo a la vista pública y mis datos dejan de ser accesibles.

### HU-04 — Ver el detalle de un curso con sus lecciones 🔴

**Como** estudiante, **quiero** entrar a un curso y ver su lista de lecciones en orden, **para** saber qué voy a aprender y por dónde empezar.

**Criterios de aceptación:**
- Las lecciones aparecen en su orden definido (1, 2, 3...).
- Se distingue visualmente cuáles lecciones ya completé.
- Veo mi porcentaje de avance en el curso.

### HU-05 — Estudiar una lección 🔴

**Como** estudiante, **quiero** abrir una lección y leer su contenido, **para** aprender el tema paso a paso sin necesitar conocimientos previos.

**Criterios de aceptación:**
- El contenido se presenta con tipografía legible en celular y computador.
- Puedo volver al curso o avanzar a la siguiente lección fácilmente.
- Puedo marcar la lección como completada y el cambio se refleja de inmediato en mi progreso.
- Si la lección tiene cuestionario, veo un botón claro para presentarlo.

### HU-06 — Presentar el cuestionario de una lección 🔴

**Como** estudiante, **quiero** responder el cuestionario de la lección, **para** poner a prueba lo que aprendí.

**Criterios de aceptación (formato Gherkin):**

- **Dado** que tengo sesión iniciada y abro el cuestionario de una lección, **cuando** la vista carga, **entonces** veo las preguntas con sus opciones y un indicador de avance ("Pregunta 2 de 5").
- **Dado** que aún tengo preguntas sin responder, **cuando** intento enviar el cuestionario, **entonces** el envío está bloqueado y se me indica que debo responder todas las preguntas.
- **Dado** que estoy respondiendo el cuestionario, **cuando** se inspecciona la información que recibe el navegador, **entonces** las respuestas correctas no están presentes en ella (la calificación ocurre únicamente en el servidor).
- **Dado** que respondí todas las preguntas, **cuando** el envío falla por pérdida de conexión, **entonces** mis respuestas seleccionadas se conservan y puedo reintentar el envío sin volver a responder.

### HU-07 — Recibir corrección y explicación inmediata 🔴

**Como** estudiante, **quiero** ver mi nota apenas envío el cuestionario, con la explicación de cada error, **para** entender en qué me equivoqué y aprender de inmediato sin frustrarme.

**Criterios de aceptación (formato Gherkin):**

- **Dado** que respondí todas las preguntas, **cuando** envío el cuestionario, **entonces** veo mi puntaje (0 a 100) de forma inmediata y sin recargar la página.
- **Dado** que envié mi cuestionario, **cuando** reviso los resultados, **entonces** cada pregunta muestra si acerté o fallé, la opción que elegí y cuál era la correcta.
- **Dado** que fallé una pregunta, **cuando** veo su resultado, **entonces** aparece destacada la explicación pedagógica de por qué mi respuesta es incorrecta.
- **Dado** que terminé un intento, **cuando** decido reintentar el cuestionario, **entonces** puedo presentarlo de nuevo sin límite de intentos y cada intento queda registrado con su fecha y puntaje.

*Nota: esta es la historia central de EduLogic — materializa la promesa "evaluación con ayuda inmediata".*

### HU-08 — Consultar mi progreso 🟡

**Como** estudiante, **quiero** ver un resumen de mi avance en todos mis cursos, **para** saber cuánto he logrado y qué me falta.

**Criterios de aceptación:**
- Veo cada curso donde tengo actividad con: porcentaje de avance, lecciones completadas vs. totales y mi mejor puntaje en los cuestionarios.
- Si no he empezado ningún curso, se me invita a explorar el catálogo.
- Los números coinciden siempre con mi actividad real.

### HU-09 — Navegar libremente entre cursos 🟡

**Como** estudiante, **quiero** cambiar de curso en cualquier momento sin restricciones, **para** explorar los temas según mis intereses.

**Criterios de aceptación:**
- Ningún curso exige completar otro para poder entrar.
- Puedo tener progreso simultáneo en varios cursos sin que se mezclen los datos.

### HU-10 — Ver mi historial de intentos 🟢

**Como** estudiante, **quiero** consultar mis intentos anteriores de un cuestionario, **para** ver cómo he mejorado con la práctica.

**Criterios de aceptación:**
- Veo la lista de mis intentos con fecha y puntaje.
- Solo puedo ver MIS intentos, nunca los de otros estudiantes.

---

## 👨‍🏫 Profesor

### HU-11 — Gestionar mis cursos 🔴

**Como** profesor, **quiero** crear, editar y eliminar cursos, **para** ofrecer contenido de aprendizaje organizado por nivel.

**Criterios de aceptación:**
- Puedo crear un curso con título, descripción y nivel; los datos se validan antes de guardar.
- Solo puedo editar y eliminar MIS cursos (no los de otros profesores).
- Eliminar un curso pide confirmación e informa que sus lecciones también se eliminan.
- Los estudiantes ven el curso en el catálogo inmediatamente después de creado.

### HU-12 — Gestionar las lecciones de un curso 🔴

**Como** profesor, **quiero** crear, editar, ordenar y eliminar las lecciones de mis cursos, **para** construir una ruta de aprendizaje progresiva.

**Criterios de aceptación:**
- Cada lección tiene título, contenido y una posición (orden) dentro del curso.
- Los estudiantes siempre ven las lecciones en el orden que definí.
- No pueden existir dos lecciones con la misma posición en un curso.

### HU-13 — Crear cuestionarios con retroalimentación 🔴

**Como** profesor, **quiero** crear el cuestionario de una lección con preguntas, opciones y la explicación de cada error, **para** que el estudiante practique y aprenda de sus fallos.

**Criterios de aceptación:**
- Cada pregunta tiene un enunciado, mínimo 2 opciones y exactamente UNA correcta (el sistema lo valida y rechaza lo contrario).
- Cada pregunta exige una explicación pedagógica (lo que verá el estudiante al fallar).
- Puedo editar y eliminar preguntas existentes.
- Un estudiante puede presentar el cuestionario apenas lo publico.

### HU-14 — Ver mi contenido publicado 🟡

**Como** profesor, **quiero** ver en un panel todos mis cursos con sus lecciones y cuestionarios, **para** administrar mi contenido desde un solo lugar.

**Criterios de aceptación:**
- El panel lista solo MIS cursos, con acceso directo a gestionar lecciones y cuestionarios de cada uno.
- Los estudiantes no pueden acceder a este panel.

---

## 🛡️ Administrador

### HU-15 — Gestionar los usuarios de la plataforma 🔴

**Como** administrador, **quiero** ver la lista de usuarios registrados con filtros y paginación, **para** supervisar quiénes usan la plataforma.

**Criterios de aceptación:**
- Veo nombre, correo, rol y estado de cada usuario (nunca su contraseña).
- Puedo filtrar por rol y navegar por páginas.
- Solo el rol administrador puede acceder a esta gestión.

### HU-16 — Cambiar el rol de un usuario 🔴

**Como** administrador, **quiero** cambiar el rol de un usuario (por ejemplo, promover un estudiante a profesor), **para** administrar los permisos de la plataforma.

**Criterios de aceptación:**
- El cambio pide confirmación y aplica de inmediato (el nuevo profesor ya puede crear cursos).
- No puedo quitarme el rol de administrador a mí mismo.

### HU-17 — Desactivar un usuario 🟡

**Como** administrador, **quiero** desactivar la cuenta de un usuario problemático, **para** proteger la plataforma sin perder el historial de su actividad.

**Criterios de aceptación:**
- Un usuario desactivado no puede iniciar sesión y recibe un mensaje claro al intentarlo.
- Su historial (intentos, progreso) se conserva en la base de datos.
- No puedo desactivarme a mí mismo.
- La acción pide confirmación y es reversible (reactivar).

### HU-18 — Supervisar el contenido 🟢

**Como** administrador, **quiero** poder editar o eliminar cualquier curso, lección o cuestionario, **para** intervenir ante contenido inadecuado o erróneo.

**Criterios de aceptación:**
- El administrador tiene los mismos permisos de gestión que el profesor dueño, sobre todo el contenido.

---

## 📊 Resumen de priorización

| Prioridad | Historias | Significado para el equipo |
|---|---|---|
| 🔴 Imprescindible | HU-01 a HU-07, HU-11 a HU-13, HU-15, HU-16 | El MVP que se demuestra en la sustentación |
| 🟡 Importante | HU-08, HU-09, HU-14, HU-17 | Completan la experiencia; entran en el plan de las semanas 2-3 |
| 🟢 Deseable | HU-10, HU-18 | Solo si el cronograma va bien en la semana 4 |

**Trazabilidad:** cada issue de desarrollo del tablero implementa una o más de estas historias (ej: la issue del motor de evaluación implementa HU-07; la del CRUD de cursos, HU-11). Al cerrar el proyecto, toda historia 🔴 debe tener sus issues en `Done`.
