# 🗄️ Modelo de Datos — EduLogic

> **Archivos de esta carpeta:**
> - `modelo.dbml` — código fuente del diagrama (editable en [dbdiagram.io](https://dbdiagram.io))
> - `diagrama-er.png` — diagrama entidad-relación exportado
>
> El modelo es **relacional (PostgreSQL)** y está normalizado hasta la **Tercera Forma Normal (3FN)**, como exige el proyecto.

## 1. Las tablas y qué guarda cada una

| Tabla | Qué recuerda | Detalles clave |
|---|---|---|
| `usuarios` | Las personas y su rol (estudiante / profesor / admin) | `email` único (identidad del login); `contrasena_hash` (bcrypt, nunca texto plano); `activo` para borrado lógico |
| `cursos` | El catálogo de la plataforma | `creador_id` → FK a usuarios: define quién puede editarlo (su profesor creador o un admin) |
| `lecciones` | El contenido de estudio | `curso_id` → FK; `orden` define la ruta paso a paso; única (curso, orden) |
| `cuestionarios` | La evaluación de una lección | `leccion_id` única → **un cuestionario por lección** (relación 1 a 1) |
| `preguntas` | Los enunciados de la evaluación | `explicacion` obligatoria: la retroalimentación pedagógica que ve el estudiante al fallar — el corazón de EduLogic |
| `opciones` | Las alternativas de cada pregunta | `es_correcta` (booleano): con esto califica el motor de evaluación. Regla de negocio: exactamente una correcta por pregunta (la valida el backend) |
| `intentos` | Cada vez que un estudiante presenta un quiz | usuario + cuestionario + `puntaje` (0-100) + fecha: el historial de desempeño |
| `respuestas_intento` | Qué opción eligió el estudiante en cada pregunta de un intento | Única (intento, pregunta): una respuesta por pregunta. Resuelve la relación muchos-a-muchos entre intentos y preguntas |
| `progreso` | Qué lecciones completó cada usuario | Única (usuario, lección): marcar dos veces no duplica (idempotente) |

## 2. Las relaciones (cardinalidades)

```
usuarios 1 ──── * cursos            (un profesor crea muchos cursos)
cursos   1 ──── * lecciones         (un curso tiene muchas lecciones, ordenadas)
lecciones 1 ──── 1 cuestionarios    (una lección tiene a lo sumo un cuestionario)
cuestionarios 1 ──── * preguntas
preguntas 1 ──── * opciones
usuarios 1 ──── * intentos          (un estudiante presenta muchos intentos)
cuestionarios 1 ──── * intentos
intentos 1 ──── * respuestas_intento
usuarios 1 ──── * progreso
lecciones 1 ──── * progreso
```

## 3. Por qué el modelo cumple 3FN

La normalización se verifica con tres preguntas, y las tres se responden con ejemplos de este mismo modelo:

**1FN — Ningún campo guarda listas.** Cada celda contiene UN valor atómico. Por eso las opciones de una pregunta NO son una columna de texto tipo `"Verdadero, Falso, Quizás"` dentro de `preguntas`, sino filas de la tabla `opciones`. Así se puede marcar cuál es la correcta, contarlas y validarlas individualmente.

**2FN — Todo atributo depende de la llave COMPLETA.** En `respuestas_intento`, cuya unicidad es la pareja (intento, pregunta), solo se guarda lo que depende de esa pareja: la opción elegida. Datos como el título del cuestionario o el puntaje NO van ahí, porque dependen solo del cuestionario o solo del intento — guardarlos duplicaría información.

**3FN — Ningún atributo depende de otro atributo que no sea la llave.** El ejemplo central: la `explicacion` del error vive en `preguntas` y NO se copia en cada `respuestas_intento`. Si se copiara, estaría repetida en miles de filas y corregir un texto implicaría actualizar todas (con riesgo de inconsistencia). En 3FN cada dato vive en un solo lugar y se llega a él mediante la llave foránea.

> Resumen para recordar: *cada atributo depende de la llave, de toda la llave, y de nada más que la llave.*

## 4. Decisiones de diseño (y su porqué)

1. **Borrado lógico de usuarios (`activo`)**: desactivar en lugar de eliminar conserva el historial (intentos, progreso) y evita romper llaves foráneas. Un usuario inactivo no puede iniciar sesión.
2. **Un cuestionario por lección (1:1)**: simplifica el MVP y la experiencia (terminas la lección → presentas SU quiz). Si el producto evolucionara a varios cuestionarios por lección, basta retirar la restricción única de `cuestionarios.leccion_id`.
3. **Borrado en cascada en la cadena de contenido** (curso → lecciones → cuestionario → preguntas → opciones): si un profesor elimina un curso, no deben quedar lecciones huérfanas. La interfaz SIEMPRE advierte antes de borrar (confirmación obligatoria).
4. **Restricciones únicas compuestas** en `lecciones(curso_id, orden)`, `respuestas_intento(intento_id, pregunta_id)` y `progreso(usuario_id, leccion_id)`: las reglas de negocio se blindan en la base de datos, no solo en el código — aunque el backend fallara, la base no permite datos inválidos.
5. **`puntaje` como `decimal(5,2)`**: los puntajes son exactos (ej: 66.67), sin errores de redondeo de los flotantes binarios.

## 5. Cómo regenerar el diagrama

1. Abrir [dbdiagram.io](https://dbdiagram.io) → New Diagram.
2. Pegar el contenido de `modelo.dbml`.
3. Export → PNG → guardar como `diagrama-er.png` en esta carpeta.
