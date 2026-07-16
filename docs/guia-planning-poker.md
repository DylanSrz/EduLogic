# 🃏 Guía de Planning Poker — EduLogic

> **Qué es:** la técnica con la que el equipo estima el tamaño de cada tarea en **story points** usando la escala Fibonacci. Se hace al inicio de cada sprint con las issues que se van a trabajar (nunca las 44 de una vez).

## Los story points en 4 ideas

1. Miden **tamaño relativo** (complejidad + esfuerzo + incertidumbre), **NO horas**. La pregunta no es "¿cuánto me demoro?" sino "¿qué tan grande es esto comparado con aquello?".
2. Usamos **Fibonacci**: `1, 2, 3, 5, 8, 13`. Los saltos crecen porque entre más grande la tarea, menos precisión tenemos — no existe el "6.5": o es 5 o es 8.
3. Una issue de **13 es una alerta**: probablemente es demasiado grande y conviene partirla o pedir que se aclare.
4. La suma de puntos completados en un sprint es nuestra **velocidad**. Con 2 sprints medidos podremos predecir cuánto cabe en los siguientes.

## Nuestra referencia (el metro patrón)

Para comparar, todos usamos las mismas anclas:

| Puntos | Se siente como... | Ejemplo del proyecto |
|---|---|---|
| **1** | Trivial, sin incógnitas | Agregar mi nombre al README |
| **2** | Pequeña y conocida | Crear la estructura de carpetas del repo |
| **3** | Un día bueno de trabajo con algo por aprender | CRUD de cursos siguiendo el patrón existente |
| **5** | Varios días, varias piezas conectadas | Login con JWT y control por roles |
| **8** | Grande, con incertidumbre real | Motor de evaluación con retroalimentación |
| **13** | Demasiado grande — hay que partirla | (no debería haber) |

## El ritual (para cada issue del sprint, ~3-5 min por issue)

1. **Se presenta la issue** (1 min): quien la conozca mejor resume qué hay que hacer. Se pueden hacer preguntas aclaratorias.
2. **Votación secreta**: cada integrante escribe su número en Discord y TODOS lo envían al mismo tiempo (acordar un "3, 2, 1, ¡ya!"). Enviar a la vez evita que el primero influencie a los demás.
3. **¿Coinciden o son vecinos?** (ej: todos 3 y 5) → se toma el mayor y siguiente issue.
4. **¿Divergencia grande?** (ej: un 2 y un 8) → el del número menor y el del mayor explican su razonamiento (uno ve algo fácil que el otro no conoce, o uno ve un riesgo que el otro no vio — **este es el momento más valioso del ejercicio**). Se vota una vez más y se toma el consenso o el mayor.
5. **Se registra** el número en el campo **Story Points** de la issue en el tablero.

## Reglas de la casa

- **Vota todo el equipo**, no solo quien hará la tarea — el conocimiento compartido es el punto.
- Los puntos **no se cambian a mitad de sprint** aunque la tarea resulte más dura: esa diferencia es aprendizaje para estimar mejor la próxima.
- La velocidad es **del equipo, no de las personas**: nunca se usa para comparar integrantes ("tú solo hiciste X puntos"). Si se usa para señalar, la gente infla las estimaciones y la herramienta muere.
- Al cierre del sprint: sumar los puntos de las issues en `Done` y anotarlos en el acta de la revisión. Esa es nuestra velocidad.
