--------------------------------------------------------
-- CONTENIDO REAL DE EDULOGIC
--------------------------------------------------------
-- Reemplaza TODO el contenido académico de la plataforma por el catálogo
-- oficial: 5 cursos STEM completos, cada uno con 4 lecciones y un
-- cuestionario por lección (4 preguntas de 4 opciones, una sola correcta,
-- todas con su explicación pedagógica).
--
-- ⚠️  ADVERTENCIA: el TRUNCATE inicial borra TODOS los cursos existentes
--     y, en cascada, sus lecciones, cuestionarios, preguntas, opciones,
--     intentos y progreso. Los USUARIOS no se tocan. Es irreversible.
--
-- Cómo ejecutarlo: pegar el archivo completo en el SQL Editor de Supabase
-- y ejecutarlo una sola vez. RESTART IDENTITY reinicia las secuencias,
-- por eso los IDs de este archivo son deterministas (1, 2, 3, ...).
--
-- Requiere que existan los profesores semilla (juan@edulogic.com y
-- laura@edulogic.com) creados por database/semillas/datos_semilla.sql.
--------------------------------------------------------

TRUNCATE cursos, lecciones, cuestionarios, preguntas, opciones,
         intentos, respuestas_intento, progreso
RESTART IDENTITY CASCADE;

--------------------------------------------------------
-- CURSOS (1-5)
--------------------------------------------------------

INSERT INTO cursos (titulo, descripcion, nivel, creador_id) VALUES

('Lógica de Programación desde Cero',
'Aprende a pensar como programador antes de escribir una sola línea de código: algoritmos, diagramas de flujo y pseudocódigo explicados desde cero, sin prerrequisitos.',
'basico',
(SELECT id FROM usuarios WHERE email = 'juan@edulogic.com')),

('Matemáticas Básicas para Programadores',
'Fortalece la base matemática que todo programador usa a diario: operaciones, jerarquía, variables y lógica proposicional, con ejemplos aplicados a la programación.',
'basico',
(SELECT id FROM usuarios WHERE email = 'laura@edulogic.com')),

('Bases de Datos Relacionales',
'Descubre cómo se guarda la información en el mundo real: tablas, llaves, relaciones y tus primeras consultas SQL, paso a paso y con ejemplos cotidianos.',
'intermedio',
(SELECT id FROM usuarios WHERE email = 'juan@edulogic.com')),

('Introducción a la Programación con Python',
'Da tus primeros pasos escribiendo código real con Python: variables, tipos de datos, condicionales y ciclos, el kit de supervivencia de cualquier programador.',
'intermedio',
(SELECT id FROM usuarios WHERE email = 'laura@edulogic.com')),

('Pensamiento Algorítmico y Resolución de Problemas',
'Lleva tu lógica al siguiente nivel: estrategias para atacar problemas difíciles, descomposición, reconocimiento de patrones y una introducción a la eficiencia de los algoritmos.',
'avanzado',
(SELECT id FROM usuarios WHERE email = 'juan@edulogic.com'));

--------------------------------------------------------
-- LECCIONES (1-20)
--------------------------------------------------------

INSERT INTO lecciones (curso_id, titulo, contenido, orden) VALUES

-- CURSO 1: Lógica de Programación desde Cero (lecciones 1-4)

(1, '¿Qué significa programar?',
'Programar es darle a una computadora una lista de instrucciones para que resuelva un problema o realice una tarea. La computadora es rapidísima pero no interpreta intenciones: hace exactamente lo que se le dice, en el orden en que se le dice. Por eso el trabajo real del programador no es memorizar comandos, sino pensar con claridad: entender el problema, dividirlo en pasos y expresarlos sin ambigüedad. En esta lección aprenderás que cualquier programa, desde una calculadora hasta una red social, es en el fondo una secuencia de instrucciones bien organizadas.',
1),

(1, 'Algoritmos: recetas para resolver problemas',
'Un algoritmo es una secuencia ordenada y finita de pasos que resuelve un problema. Una receta de cocina es un algoritmo: tiene ingredientes (entradas), pasos precisos y un resultado (salida). Para que un algoritmo funcione debe cumplir tres condiciones: ser ordenado (los pasos van en una secuencia lógica), ser preciso (cada paso se entiende de una sola manera) y ser finito (termina en algún momento). Antes de programar cualquier cosa, los programadores diseñan el algoritmo: si los pasos están mal pensados, ningún lenguaje de programación los va a arreglar.',
2),

(1, 'Diagramas de flujo: dibujar la lógica',
'Un diagrama de flujo representa un algoritmo con símbolos conectados por flechas, para ver la lógica de un vistazo. Los símbolos principales son: el óvalo para el inicio y el fin, el rectángulo para un proceso o acción, el rombo para una decisión (una pregunta con dos caminos: sí o no) y las flechas que indican el orden del flujo. Los diagramas son especialmente útiles cuando el algoritmo tiene decisiones: puedes seguir cada camino con el dedo y descubrir errores de lógica antes de escribir código.',
3),

(1, 'Pseudocódigo: casi código, en tu idioma',
'El pseudocódigo es una forma de escribir algoritmos usando frases cortas parecidas al código, pero en lenguaje humano. Por ejemplo: "LEER edad; SI edad >= 18 ENTONCES mostrar ''puede votar''; SI NO mostrar ''no puede votar''". No pertenece a ningún lenguaje de programación, así que no hay que preocuparse por la sintaxis exacta: lo importante es la lógica. Es el puente perfecto entre el diagrama de flujo y el código real: cuando tu pseudocódigo funciona en papel, traducirlo a Python o a cualquier lenguaje es lo más fácil del proceso.',
4),

-- CURSO 2: Matemáticas Básicas para Programadores (lecciones 5-8)

(2, 'Operaciones fundamentales aplicadas',
'La suma, la resta, la multiplicación y la división son las cuatro operaciones que la computadora ejecuta millones de veces por segundo. En programación aparecen en todas partes: sumar los productos de un carrito, calcular un promedio de notas o repartir jugadores en equipos. También usarás dos parientes muy útiles: la división entera (cuántas veces cabe) y el módulo o residuo (lo que sobra). El módulo, escrito % en muchos lenguajes, responde preguntas como "¿este número es par?" — si el residuo de dividir entre 2 es 0, es par.',
1),

(2, 'Jerarquía de operaciones',
'Cuando una expresión mezcla varias operaciones, no se resuelve de izquierda a derecha a ciegas: existe un orden de prioridad. Primero los paréntesis, luego las potencias, después multiplicaciones y divisiones, y al final sumas y restas. Por eso 5 + 3 × 2 vale 11 y no 16: la multiplicación va primero. Las computadoras siguen esta jerarquía al pie de la letra, así que un paréntesis mal puesto cambia el resultado de un cálculo. Regla práctica de programador: ante la duda, usa paréntesis — hacen el código más claro y evitan errores silenciosos.',
2),

(2, 'Variables y expresiones',
'Una variable es un nombre que guarda un valor que puede cambiar: en matemáticas se escribe x = 5, y en programación edad = 25. Con variables se escriben expresiones generales que funcionan para cualquier valor: el área de un rectángulo es base × altura sin importar cuánto midan. Evaluar una expresión es reemplazar cada variable por su valor y aplicar la jerarquía de operaciones: si x = 4, entonces 2x + 3 vale 11. Este es el corazón del álgebra y también el del código: los programas son expresiones que se evalúan con los datos del usuario.',
3),

(2, 'Lógica proposicional: verdadero o falso',
'Una proposición es una afirmación que solo puede ser verdadera o falsa: "5 es mayor que 3" es verdadera. Los operadores lógicos combinan proposiciones: Y (AND) exige que ambas sean verdaderas, O (OR) se conforma con que al menos una lo sea, y NO (NOT) invierte el valor. Ejemplo: "llueve Y tengo paraguas" solo es verdadera si ocurren las dos cosas. Los programas toman decisiones evaluando exactamente estas combinaciones: "SI el usuario existe Y la contraseña es correcta, ENTONCES iniciar sesión". Dominar esta lógica es dominar los condicionales de cualquier lenguaje.',
4),

-- CURSO 3: Bases de Datos Relacionales (lecciones 9-12)

(3, '¿Qué es una base de datos?',
'Una base de datos es un sistema para guardar información de forma organizada, segura y consultable. La diferencia con una hoja de cálculo está en las garantías: una base de datos evita datos duplicados o contradictorios, permite que muchas personas consulten y escriban al mismo tiempo sin pisarse, y responde preguntas complejas en milisegundos aunque haya millones de registros. Casi toda aplicación que usas — redes sociales, bancos, plataformas educativas como esta — tiene una base de datos detrás recordándolo todo.',
1),

(3, 'Tablas, filas y llave primaria',
'Las bases de datos relacionales organizan la información en tablas, parecidas a una cuadrícula: cada columna es un atributo (nombre, email, edad) y cada fila es un registro (una persona concreta). Para identificar cada fila sin confusión existe la llave primaria: un valor único que no se repite jamás, normalmente un número id. Dos usuarios pueden llamarse igual, pero nunca tendrán el mismo id. Gracias a la llave primaria, el sistema puede encontrar, actualizar o relacionar un registro exacto entre millones.',
2),

(3, 'Relaciones y llaves foráneas',
'El poder del modelo relacional está en conectar tablas. Una llave foránea es una columna que guarda la llave primaria de otra tabla: en la tabla lecciones, la columna curso_id apunta al curso al que pertenece cada lección. Así se forman relaciones uno-a-muchos: un curso tiene muchas lecciones, pero cada lección pertenece a un solo curso. La base de datos vigila estas conexiones con la integridad referencial: no te deja crear una lección de un curso que no existe, ni borrar un curso dejando lecciones huérfanas. Los datos se cuidan solos.',
3),

(3, 'Tu primera consulta: SELECT',
'SQL es el idioma para conversar con una base de datos relacional, y SELECT es su verbo más usado: sirve para pedir datos. "SELECT nombre, email FROM usuarios" trae esas dos columnas de todos los usuarios. Con WHERE se filtra: "SELECT * FROM cursos WHERE nivel = ''basico''" trae solo los cursos básicos. Y con ORDER BY se ordena el resultado. Lo elegante de SQL es que es declarativo: tú describes QUÉ información quieres, y el motor de la base de datos decide CÓMO encontrarla de la forma más eficiente.',
4),

-- CURSO 4: Introducción a la Programación con Python (lecciones 13-16)

(4, 'Hola, Python',
'Python es uno de los lenguajes más usados del mundo y el favorito para aprender: su sintaxis se parece al inglés y elimina ceremonias innecesarias. El programa más famoso de la historia se escribe en una sola línea: print("Hola, mundo"). La función print() muestra mensajes en pantalla y será tu mejor amiga para ver qué está haciendo tu programa. En Python cada línea es una instrucción que se ejecuta de arriba hacia abajo, exactamente como los algoritmos que ya sabes diseñar: programar es traducir tu pseudocódigo a un idioma que la máquina entiende.',
1),

(4, 'Variables y tipos de datos',
'En Python creas una variable al asignarle un valor con el signo igual: edad = 25. Cada valor tiene un tipo: int para enteros (25), float para decimales (3.14), str para texto entre comillas ("hola") y bool para verdadero o falso (True, False). El tipo importa porque define qué puedes hacer: los números se suman aritméticamente, pero "2" + "3" no da 5 sino "23", porque con textos el signo + concatena (pega). Conocer el tipo de tus datos evita la familia de errores más común de los principiantes.',
2),

(4, 'Condicionales: programas que deciden',
'El condicional if permite que el programa tome caminos distintos según los datos. Su estructura en Python: "if edad >= 18:" ejecuta el bloque indentado solo si la condición es verdadera; "else:" cubre el caso contrario, y "elif" encadena condiciones intermedias. La indentación (los espacios al inicio de línea) no es decoración: es la forma en que Python sabe qué instrucciones pertenecen a cada camino. Las condiciones usan los operadores lógicos que ya conoces: "if usuario_existe and contrasena_correcta:" — la lógica proposicional hecha código.',
3),

(4, 'Ciclos: repetir sin repetirse',
'Los ciclos ejecutan un bloque de código varias veces sin copiarlo y pegarlo. El ciclo for recorre una secuencia: "for numero in range(5):" repite el bloque 5 veces, con numero tomando los valores 0, 1, 2, 3 y 4. El ciclo while repite mientras una condición sea verdadera: "while intentos < 3:" — ideal cuando no sabes de antemano cuántas vueltas harán falta. Cuidado con el clásico ciclo infinito: si la condición del while nunca se vuelve falsa, el programa no termina jamás. Todo ciclo debe acercarse a su final en cada vuelta.',
4),

-- CURSO 5: Pensamiento Algorítmico y Resolución de Problemas (lecciones 17-20)

(5, 'Cómo atacar un problema difícil',
'Ante un problema difícil, el peor primer paso es escribir código. Los buenos programadores primero entienden: ¿cuáles son las entradas?, ¿cuál es la salida esperada?, ¿qué casos raros existen? Una técnica poderosa es resolver el problema a mano con un ejemplo pequeño y observar tu propio razonamiento: los pasos que seguiste SON el algoritmo. Otra es reformular el problema con tus palabras — si no puedes explicarlo simple, aún no lo entiendes. Solo cuando el plan está claro en papel, se escribe código.',
1),

(5, 'Descomposición: divide y vencerás',
'La descomposición consiste en partir un problema grande en subproblemas pequeños que se resuelven por separado. "Construir una plataforma educativa" paraliza a cualquiera; "validar un formulario de registro" se resuelve en una tarde. Cada subproblema se convierte en una pieza con una responsabilidad clara — como las funciones de un programa — y las piezas se combinan para formar la solución completa. Además, dividir permite repartir el trabajo en equipo y probar cada parte por separado: si algo falla, sabes exactamente dónde buscar.',
2),

(5, 'Patrones: no resuelvas dos veces lo mismo',
'Muchos problemas distintos comparten la misma estructura interna. Encontrar el estudiante con mejor puntaje, el producto más caro o el día más lluvioso son el mismo patrón: "recorrer una colección guardando el máximo". Reconocer patrones te permite reutilizar soluciones probadas en lugar de empezar de cero, y generalizar: resolver "el máximo de CUALQUIER lista" en vez de un caso puntual. Con la práctica construyes un catálogo mental de patrones — búsqueda, conteo, acumulación, filtrado — y los problemas nuevos empiezan a parecerte combinaciones de problemas viejos.',
3),

(5, 'Eficiencia: no basta con que funcione',
'Dos algoritmos correctos pueden comportarse muy distinto cuando los datos crecen. Para buscar una palabra en un diccionario puedes leer página por página (búsqueda lineal) o abrir por la mitad y descartar la mitad equivocada en cada paso (búsqueda binaria): con un millón de palabras, la primera puede necesitar un millón de revisiones; la segunda, unas veinte. La eficiencia mide cómo escala el trabajo de un algoritmo con el tamaño de la entrada. No siempre necesitas el algoritmo más veloz, pero sí saber preguntarte: ¿qué pasa con mi solución cuando los datos se multiplican por mil?',
4);

--------------------------------------------------------
-- CUESTIONARIOS (1-20): uno por lección
--------------------------------------------------------

INSERT INTO cuestionarios (leccion_id, titulo) VALUES
(1,  'Cuestionario: ¿Qué significa programar?'),
(2,  'Cuestionario: Algoritmos'),
(3,  'Cuestionario: Diagramas de flujo'),
(4,  'Cuestionario: Pseudocódigo'),
(5,  'Cuestionario: Operaciones fundamentales'),
(6,  'Cuestionario: Jerarquía de operaciones'),
(7,  'Cuestionario: Variables y expresiones'),
(8,  'Cuestionario: Lógica proposicional'),
(9,  'Cuestionario: ¿Qué es una base de datos?'),
(10, 'Cuestionario: Tablas, filas y llave primaria'),
(11, 'Cuestionario: Relaciones y llaves foráneas'),
(12, 'Cuestionario: Tu primera consulta SELECT'),
(13, 'Cuestionario: Hola, Python'),
(14, 'Cuestionario: Variables y tipos de datos'),
(15, 'Cuestionario: Condicionales'),
(16, 'Cuestionario: Ciclos'),
(17, 'Cuestionario: Cómo atacar un problema'),
(18, 'Cuestionario: Descomposición'),
(19, 'Cuestionario: Patrones'),
(20, 'Cuestionario: Eficiencia');

--------------------------------------------------------
-- PREGUNTAS (1-80): 4 por cuestionario
--------------------------------------------------------

INSERT INTO preguntas (cuestionario_id, enunciado, explicacion) VALUES

-- Cuestionario 1 (preguntas 1-4)
(1, '¿Qué es programar?',
'Programar es darle a la computadora una lista de instrucciones organizadas para resolver un problema o realizar una tarea.'),
(1, '¿Por qué las instrucciones de un programa deben ser precisas?',
'La computadora ejecuta exactamente lo que se le indica, sin interpretar intenciones: una instrucción ambigua produce resultados incorrectos.'),
(1, '¿Cuál es el verdadero trabajo de un programador?',
'Más que memorizar comandos, el programador entiende el problema, lo divide en pasos y los expresa con claridad — el código es la traducción final de ese pensamiento.'),
(1, '¿Qué tienen en común una calculadora y una red social?',
'Todo programa, simple o complejo, es en el fondo una secuencia de instrucciones bien organizadas que la computadora ejecuta.'),

-- Cuestionario 2 (preguntas 5-8)
(2, '¿Qué es un algoritmo?',
'Un algoritmo es una secuencia ordenada y finita de pasos que permite resolver un problema.'),
(2, '¿Cuál de las siguientes es una condición obligatoria de todo algoritmo?',
'Un algoritmo debe ser finito: si nunca termina, no resuelve nada.'),
(2, '¿Por qué una receta de cocina es un buen ejemplo de algoritmo?',
'Tiene entradas (ingredientes), pasos precisos en orden y un resultado final — la misma estructura de cualquier algoritmo.'),
(2, '¿Qué pasa si el algoritmo está mal diseñado pero el código está bien escrito?',
'El programa ejecutará fielmente una lógica equivocada: ningún lenguaje de programación corrige un algoritmo mal pensado.'),

-- Cuestionario 3 (preguntas 9-12)
(3, '¿Para qué sirve un diagrama de flujo?',
'Representa visualmente la lógica de un algoritmo, lo que permite entenderla y revisarla de un vistazo.'),
(3, '¿Qué símbolo representa una decisión en un diagrama de flujo?',
'El rombo plantea una pregunta con dos caminos posibles: sí o no.'),
(3, '¿Qué indican las flechas en un diagrama de flujo?',
'Las flechas marcan el orden en que fluye el proceso de un paso al siguiente.'),
(3, '¿Qué símbolo marca el inicio y el fin de un diagrama de flujo?',
'El óvalo se usa para señalar dónde comienza y dónde termina el algoritmo.'),

-- Cuestionario 4 (preguntas 13-16)
(4, '¿Qué es el pseudocódigo?',
'Es una forma de escribir algoritmos con frases parecidas al código pero en lenguaje humano, sin la sintaxis de un lenguaje específico.'),
(4, '¿Cuál es la principal ventaja del pseudocódigo?',
'Permite concentrarse en la lógica de la solución sin preocuparse por la sintaxis exacta de un lenguaje.'),
(4, '¿El pseudocódigo pertenece a algún lenguaje de programación?',
'No: es independiente del lenguaje, por eso cualquier programador puede leerlo sin importar la tecnología que use.'),
(4, '¿En qué momento del proceso conviene escribir pseudocódigo?',
'Antes de programar: cuando la lógica funciona en papel, traducirla a un lenguaje real es la parte fácil.'),

-- Cuestionario 5 (preguntas 17-20)
(5, '¿Qué operación devuelve el residuo de una división?',
'El módulo (%) devuelve lo que sobra al dividir: 7 % 2 = 1, porque 7 entre 2 cabe 3 veces y sobra 1.'),
(5, '¿Cómo se puede saber si un número es par usando el módulo?',
'Un número es par cuando el residuo de dividirlo entre 2 es 0.'),
(5, '¿Cuál es el resultado de la división entera de 17 entre 5?',
'La división entera responde cuántas veces cabe completo: 5 cabe 3 veces en 17 (y sobran 2).'),
(5, '¿Dónde aparecen las operaciones básicas en la programación real?',
'En todas partes: totales de un carrito de compras, promedios de notas, repartos — son el pan de cada día de cualquier programa.'),

-- Cuestionario 6 (preguntas 21-24)
(6, '¿Cuál es el resultado de 5 + 3 × 2?',
'La multiplicación tiene prioridad sobre la suma: 3 × 2 = 6, y luego 5 + 6 = 11.'),
(6, '¿Qué se resuelve primero en cualquier expresión?',
'Los paréntesis tienen la máxima prioridad en la jerarquía de operaciones.'),
(6, '¿Cuál es el resultado de (6 + 2) × 3?',
'Primero el paréntesis: 6 + 2 = 8; luego la multiplicación: 8 × 3 = 24.'),
(6, '¿Por qué conviene usar paréntesis aunque no sean obligatorios?',
'Hacen explícito el orden del cálculo: el código queda más claro y se evitan errores silenciosos de prioridad.'),

-- Cuestionario 7 (preguntas 25-28)
(7, '¿Qué es una variable?',
'Es un nombre que guarda un valor que puede cambiar durante la ejecución.'),
(7, 'Si x = 4, ¿cuánto vale 2x + 3?',
'Se reemplaza x por su valor: 2 × 4 + 3 = 8 + 3 = 11 (la multiplicación va primero).'),
(7, '¿Qué significa evaluar una expresión?',
'Reemplazar cada variable por su valor y resolver las operaciones respetando la jerarquía.'),
(7, '¿Por qué las variables hacen las fórmulas más poderosas?',
'Porque la misma expresión funciona para cualquier valor: base × altura calcula el área de TODOS los rectángulos, no de uno solo.'),

-- Cuestionario 8 (preguntas 29-32)
(8, '¿Qué es una proposición?',
'Una afirmación que solo puede ser verdadera o falsa, sin puntos medios.'),
(8, '¿Cuándo es verdadera la expresión "A Y B" (AND)?',
'El operador Y exige que ambas proposiciones sean verdaderas a la vez.'),
(8, '¿Cuándo es verdadera la expresión "A O B" (OR)?',
'Al operador O le basta con que al menos una de las dos proposiciones sea verdadera.'),
(8, '¿Qué hace el operador NO (NOT)?',
'Invierte el valor de la proposición: lo verdadero se vuelve falso y lo falso, verdadero.'),

-- Cuestionario 9 (preguntas 33-36)
(9, '¿Qué es una base de datos?',
'Un sistema para guardar información de forma organizada, segura y consultable.'),
(9, '¿Qué ventaja tiene una base de datos sobre una hoja de cálculo?',
'Garantiza la integridad de los datos y soporta muchos usuarios simultáneos sin conflictos, incluso con millones de registros.'),
(9, '¿Qué aplicaciones usan bases de datos?',
'Prácticamente todas: redes sociales, bancos, tiendas en línea y plataformas educativas guardan su información en una base de datos.'),
(9, '¿Qué significa que una base de datos sea "consultable"?',
'Que puede responder preguntas sobre los datos (búsquedas, filtros, conteos) de forma rápida y precisa.'),

-- Cuestionario 10 (preguntas 37-40)
(10, '¿Qué representa una fila en una tabla?',
'Una fila es un registro completo: por ejemplo, una persona concreta con todos sus datos.'),
(10, '¿Qué representa una columna en una tabla?',
'Una columna es un atributo que todos los registros comparten, como el nombre o el email.'),
(10, '¿Qué es la llave primaria?',
'Un valor único que identifica cada fila sin ambigüedad: nunca se repite dentro de la tabla.'),
(10, '¿Por qué no conviene usar el nombre de una persona como llave primaria?',
'Porque los nombres pueden repetirse: dos personas distintas pueden llamarse igual, y la llave primaria debe ser única.'),

-- Cuestionario 11 (preguntas 41-44)
(11, '¿Qué es una llave foránea?',
'Una columna que guarda la llave primaria de otra tabla, conectando ambas tablas.'),
(11, 'En EduLogic, ¿qué relación existe entre cursos y lecciones?',
'Uno a muchos: un curso tiene muchas lecciones, pero cada lección pertenece a un solo curso.'),
(11, '¿Qué es la integridad referencial?',
'La garantía de que las conexiones entre tablas siempre son válidas: no puede existir una lección que apunte a un curso inexistente.'),
(11, '¿Qué pasa si intentas crear una lección con un curso_id que no existe?',
'La base de datos rechaza la operación: la integridad referencial impide registros huérfanos.'),

-- Cuestionario 12 (preguntas 45-48)
(12, '¿Para qué sirve la instrucción SELECT?',
'SELECT pide datos a la base: indica qué columnas traer y de qué tabla.'),
(12, '¿Qué hace la cláusula WHERE?',
'Filtra los resultados: solo devuelve las filas que cumplen la condición indicada.'),
(12, '¿Qué consulta trae solo los cursos de nivel básico?',
'SELECT * FROM cursos WHERE nivel = ''basico'' — el WHERE filtra por el valor de la columna nivel.'),
(12, '¿Qué significa que SQL sea un lenguaje declarativo?',
'Que describes QUÉ datos quieres y el motor decide CÓMO buscarlos de la forma más eficiente.'),

-- Cuestionario 13 (preguntas 49-52)
(13, '¿Qué hace la función print() en Python?',
'Muestra mensajes o valores en pantalla: es la forma básica de ver qué hace el programa.'),
(13, '¿En qué orden ejecuta Python las instrucciones de un programa?',
'De arriba hacia abajo, línea por línea, igual que los pasos de un algoritmo.'),
(13, '¿Por qué Python es recomendado para aprender a programar?',
'Su sintaxis es clara y cercana al inglés, lo que permite concentrarse en la lógica en vez de en ceremonias del lenguaje.'),
(13, '¿Cuál es la relación entre pseudocódigo y un programa en Python?',
'Programar es traducir la lógica ya diseñada (el pseudocódigo) a un idioma que la máquina entiende.'),

-- Cuestionario 14 (preguntas 53-56)
(14, '¿Cómo se crea una variable en Python?',
'Asignándole un valor con el signo igual: edad = 25 crea la variable edad con el valor 25.'),
(14, '¿Qué tipo de dato es 3.14 en Python?',
'Los números con decimales son de tipo float.'),
(14, '¿Cuál es el resultado de "2" + "3" en Python?',
'Con textos (str), el signo + concatena en lugar de sumar: "2" + "3" produce "23".'),
(14, '¿Qué tipo de dato guarda los valores True y False?',
'El tipo bool (booleano) representa los dos valores lógicos: verdadero y falso.'),

-- Cuestionario 15 (preguntas 57-60)
(15, '¿Qué hace la instrucción if?',
'Ejecuta un bloque de código solo si su condición es verdadera: permite que el programa tome decisiones.'),
(15, '¿Para qué sirve else?',
'Define el camino que se ejecuta cuando la condición del if es falsa.'),
(15, '¿Qué papel juega la indentación en Python?',
'Define qué instrucciones pertenecen a cada bloque: no es decoración, es parte del lenguaje.'),
(15, '¿Cuándo se ejecuta el bloque de "if usuario_existe and contrasena_correcta:"?',
'Solo cuando ambas condiciones son verdaderas a la vez: el operador and lo exige.'),

-- Cuestionario 16 (preguntas 61-64)
(16, '¿Qué valores toma numero en "for numero in range(5):"?',
'range(5) genera 0, 1, 2, 3 y 4: cinco valores comenzando desde cero.'),
(16, '¿Cuándo conviene usar while en lugar de for?',
'Cuando no se sabe de antemano cuántas repeticiones harán falta: while repite mientras la condición siga siendo verdadera.'),
(16, '¿Qué es un ciclo infinito?',
'Un while cuya condición nunca se vuelve falsa: el programa repite para siempre y no termina.'),
(16, '¿Qué debe garantizar todo ciclo bien diseñado?',
'Que en cada vuelta se acerque a su condición de salida — de lo contrario nunca terminará.'),

-- Cuestionario 17 (preguntas 65-68)
(17, '¿Cuál debe ser el PRIMER paso ante un problema difícil?',
'Entender el problema: identificar entradas, salida esperada y casos especiales, antes de escribir cualquier código.'),
(17, '¿Por qué es útil resolver el problema a mano con un ejemplo pequeño?',
'Los pasos que sigues al resolverlo manualmente SON el algoritmo: observar tu razonamiento revela la solución.'),
(17, '¿Qué señal indica que aún no entiendes bien un problema?',
'No poder explicarlo con tus propias palabras de forma simple: si no puedes explicarlo, no lo entiendes todavía.'),
(17, '¿Cuándo es el momento correcto para empezar a escribir código?',
'Cuando el plan de solución ya está claro en papel: el código es la traducción del plan, no el sustituto.'),

-- Cuestionario 18 (preguntas 69-72)
(18, '¿En qué consiste la descomposición de problemas?',
'En partir un problema grande en subproblemas pequeños que se resuelven por separado.'),
(18, '¿Qué característica debe tener cada subproblema?',
'Una responsabilidad clara y única, como las funciones de un programa bien diseñado.'),
(18, '¿Qué ventaja aporta la descomposición al trabajo en equipo?',
'Permite repartir las piezas entre personas y probarlas por separado: si algo falla, se sabe dónde buscar.'),
(18, '¿Por qué "construir una plataforma completa" paraliza y "validar un formulario" no?',
'Porque la mente trabaja mejor con problemas acotados: la descomposición convierte lo imposible en una lista de tareas alcanzables.'),

-- Cuestionario 19 (preguntas 73-76)
(19, '¿Qué es un patrón en resolución de problemas?',
'Una estructura de solución que se repite en problemas aparentemente distintos.'),
(19, '¿Qué patrón comparten "hallar el mejor puntaje" y "hallar el producto más caro"?',
'Ambos son el patrón de máximo: recorrer una colección guardando el mayor valor visto.'),
(19, '¿Qué significa generalizar una solución?',
'Resolver la versión amplia del problema (el máximo de cualquier lista) en lugar de un caso puntual.'),
(19, '¿Qué beneficio da reconocer patrones con la práctica?',
'Los problemas nuevos empiezan a verse como combinaciones de problemas ya resueltos, y se reutilizan soluciones probadas.'),

-- Cuestionario 20 (preguntas 77-80)
(20, '¿Qué mide la eficiencia de un algoritmo?',
'Cómo crece el trabajo que realiza a medida que crece el tamaño de la entrada.'),
(20, '¿Por qué la búsqueda binaria es más eficiente que la lineal en un diccionario?',
'Porque descarta la mitad de las opciones en cada paso: con un millón de palabras necesita unas veinte revisiones, no un millón.'),
(20, '¿Qué requisito necesita la búsqueda binaria para funcionar?',
'Que los datos estén ordenados: solo así descartar una mitad tiene sentido.'),
(20, '¿Dos algoritmos correctos pueden comportarse distinto?',
'Sí: ambos dan la respuesta correcta, pero al crecer los datos uno puede tardar segundos y el otro horas — por eso importa la eficiencia.');

--------------------------------------------------------
-- OPCIONES (4 por pregunta, la correcta en posición variable)
--------------------------------------------------------

INSERT INTO opciones (pregunta_id, texto, es_correcta) VALUES

-- Pregunta 1
(1, 'Reparar el hardware de los computadores', FALSE),
(1, 'Dar a la computadora instrucciones organizadas para resolver un problema', TRUE),
(1, 'Instalar programas descargados de internet', FALSE),
(1, 'Diseñar los circuitos de un procesador', FALSE),

-- Pregunta 2
(2, 'Porque la computadora ejecuta exactamente lo que se le dice, sin interpretar', TRUE),
(2, 'Porque los programas cortos son siempre mejores', FALSE),
(2, 'Porque la computadora corrige sola las instrucciones vagas', FALSE),
(2, 'Porque las instrucciones se escriben solo en inglés', FALSE),

-- Pregunta 3
(3, 'Memorizar la mayor cantidad de comandos posible', FALSE),
(3, 'Escribir código lo más rápido que pueda', FALSE),
(3, 'Entender el problema y expresar su solución en pasos claros', TRUE),
(3, 'Conocer todos los lenguajes de programación', FALSE),

-- Pregunta 4
(4, 'Ambas se ejecutan sin instrucciones', FALSE),
(4, 'Ambas funcionan sin conexión a internet', FALSE),
(4, 'Ambas fueron creadas por la misma empresa', FALSE),
(4, 'Ambas son secuencias de instrucciones organizadas', TRUE),

-- Pregunta 5
(5, 'Una secuencia ordenada y finita de pasos que resuelve un problema', TRUE),
(5, 'Un lenguaje de programación moderno', FALSE),
(5, 'Un tipo de computadora muy veloz', FALSE),
(5, 'Un programa que ya viene instalado', FALSE),

-- Pregunta 6
(6, 'Estar escrito en un computador', FALSE),
(6, 'Ser finito: terminar en algún momento', TRUE),
(6, 'Tener al menos cien pasos', FALSE),
(6, 'Usar símbolos matemáticos avanzados', FALSE),

-- Pregunta 7
(7, 'Porque solo los chefs pueden escribir algoritmos', FALSE),
(7, 'Porque cocinar requiere una computadora', FALSE),
(7, 'Porque tiene entradas, pasos precisos y un resultado final', TRUE),
(7, 'Porque las recetas nunca fallan', FALSE),

-- Pregunta 8
(8, 'El lenguaje corrige automáticamente la lógica', FALSE),
(8, 'El programa no compila hasta arreglar la lógica', FALSE),
(8, 'El resultado es correcto de todas formas', FALSE),
(8, 'El programa ejecuta fielmente una lógica equivocada', TRUE),

-- Pregunta 9
(9, 'Representar visualmente la lógica de un algoritmo', TRUE),
(9, 'Decorar la documentación del proyecto', FALSE),
(9, 'Reemplazar por completo el código fuente', FALSE),
(9, 'Medir la velocidad de un programa', FALSE),

-- Pregunta 10
(10, 'El rectángulo', FALSE),
(10, 'El óvalo', FALSE),
(10, 'El rombo', TRUE),
(10, 'La flecha', FALSE),

-- Pregunta 11
(11, 'Los errores del algoritmo', FALSE),
(11, 'El orden en que fluye el proceso', TRUE),
(11, 'La velocidad de ejecución', FALSE),
(11, 'La importancia de cada paso', FALSE),

-- Pregunta 12
(12, 'El rombo', FALSE),
(12, 'El rectángulo', FALSE),
(12, 'La flecha doble', FALSE),
(12, 'El óvalo', TRUE),

-- Pregunta 13
(13, 'Una forma de escribir algoritmos en lenguaje humano estructurado', TRUE),
(13, 'Un lenguaje de programación compilado', FALSE),
(13, 'El código que produce un virus', FALSE),
(13, 'Un error de sintaxis en el código', FALSE),

-- Pregunta 14
(14, 'Se ejecuta más rápido que el código real', FALSE),
(14, 'Permite concentrarse en la lógica sin preocuparse por la sintaxis', TRUE),
(14, 'Reemplaza las pruebas del programa', FALSE),
(14, 'Solo lo entienden los programadores expertos', FALSE),

-- Pregunta 15
(15, 'Sí, solo funciona en Python', FALSE),
(15, 'Sí, es exclusivo de Java', FALSE),
(15, 'No, es independiente de cualquier lenguaje', TRUE),
(15, 'Sí, depende del sistema operativo', FALSE),

-- Pregunta 16
(16, 'Después de terminar todo el programa', FALSE),
(16, 'Nunca: es una pérdida de tiempo', FALSE),
(16, 'Solo cuando el código tiene errores', FALSE),
(16, 'Antes de programar, para diseñar la lógica', TRUE),

-- Pregunta 17
(17, 'La potencia', FALSE),
(17, 'El módulo (%)', TRUE),
(17, 'La división entera', FALSE),
(17, 'La raíz cuadrada', FALSE),

-- Pregunta 18
(18, 'Si el residuo de dividirlo entre 2 es 0, es par', TRUE),
(18, 'Si termina en 3, es par', FALSE),
(18, 'Si es mayor que 10, es par', FALSE),
(18, 'Si su mitad es negativa, es par', FALSE),

-- Pregunta 19
(19, '2', FALSE),
(19, '4', FALSE),
(19, '3', TRUE),
(19, '5', FALSE),

-- Pregunta 20
(20, 'Solo en programas científicos muy avanzados', FALSE),
(20, 'Solo en los videojuegos', FALSE),
(20, 'En cálculos cotidianos: totales, promedios, repartos', TRUE),
(20, 'Casi nunca: las computadoras no calculan', FALSE),

-- Pregunta 21
(21, '16', FALSE),
(21, '11', TRUE),
(21, '13', FALSE),
(21, '30', FALSE),

-- Pregunta 22
(22, 'Las sumas', FALSE),
(22, 'Las divisiones', FALSE),
(22, 'Los paréntesis', TRUE),
(22, 'Las restas', FALSE),

-- Pregunta 23
(23, '24', TRUE),
(23, '12', FALSE),
(23, '18', FALSE),
(23, '36', FALSE),

-- Pregunta 24
(24, 'Hacen que el programa se ejecute más rápido', FALSE),
(24, 'Hacen explícito el orden y evitan errores de prioridad', TRUE),
(24, 'Son obligatorios en todos los lenguajes', FALSE),
(24, 'Reducen el tamaño del archivo', FALSE),

-- Pregunta 25
(25, 'Un número que nunca cambia', FALSE),
(25, 'Una operación matemática', FALSE),
(25, 'Un tipo de computadora', FALSE),
(25, 'Un nombre que guarda un valor que puede cambiar', TRUE),

-- Pregunta 26
(26, '11', TRUE),
(26, '14', FALSE),
(26, '10', FALSE),
(26, '24', FALSE),

-- Pregunta 27
(27, 'Borrar las variables del programa', FALSE),
(27, 'Reemplazar las variables por sus valores y resolver las operaciones', TRUE),
(27, 'Cambiar el nombre de las variables', FALSE),
(27, 'Convertir la expresión en un diagrama', FALSE),

-- Pregunta 28
(28, 'Porque las fórmulas con letras se ven más profesionales', FALSE),
(28, 'Porque los números son difíciles de escribir', FALSE),
(28, 'Porque la misma expresión funciona para cualquier valor', TRUE),
(28, 'Porque las variables hacen los cálculos más rápidos', FALSE),

-- Pregunta 29
(29, 'Una afirmación que solo puede ser verdadera o falsa', TRUE),
(29, 'Una pregunta sin respuesta', FALSE),
(29, 'Una operación entre números decimales', FALSE),
(29, 'Una opinión personal', FALSE),

-- Pregunta 30
(30, 'Cuando al menos una es verdadera', FALSE),
(30, 'Cuando ambas son falsas', FALSE),
(30, 'Cuando ambas son verdaderas a la vez', TRUE),
(30, 'Siempre, sin importar los valores', FALSE),

-- Pregunta 31
(31, 'Cuando al menos una de las dos es verdadera', TRUE),
(31, 'Solo cuando ambas son verdaderas', FALSE),
(31, 'Solo cuando ambas son falsas', FALSE),
(31, 'Nunca: el O siempre es falso', FALSE),

-- Pregunta 32
(32, 'Repite la proposición dos veces', FALSE),
(32, 'Convierte la proposición en pregunta', FALSE),
(32, 'Elimina la proposición', FALSE),
(32, 'Invierte su valor: verdadero pasa a falso y viceversa', TRUE),

-- Pregunta 33
(33, 'Un sistema para guardar información organizada, segura y consultable', TRUE),
(33, 'Un programa para editar documentos de texto', FALSE),
(33, 'Una carpeta de archivos en el escritorio', FALSE),
(33, 'Un tipo de página web', FALSE),

-- Pregunta 34
(34, 'Es más bonita visualmente', FALSE),
(34, 'Garantiza integridad y soporta muchos usuarios a la vez', TRUE),
(34, 'No necesita computadora para funcionar', FALSE),
(34, 'Solo puede usarla una persona, lo que da más seguridad', FALSE),

-- Pregunta 35
(35, 'Solo las aplicaciones bancarias', FALSE),
(35, 'Solo los sitios del gobierno', FALSE),
(35, 'Prácticamente todas: redes sociales, bancos, tiendas, plataformas educativas', TRUE),
(35, 'Ninguna aplicación moderna las usa', FALSE),

-- Pregunta 36
(36, 'Que puede responder preguntas sobre los datos de forma rápida y precisa', TRUE),
(36, 'Que cualquiera puede modificarla sin permisos', FALSE),
(36, 'Que se puede imprimir en papel', FALSE),
(36, 'Que solo funciona con internet', FALSE),

-- Pregunta 37
(37, 'Un atributo compartido por todos los registros', FALSE),
(37, 'Un registro completo, como una persona con todos sus datos', TRUE),
(37, 'El nombre de la tabla', FALSE),
(37, 'Una consulta guardada', FALSE),

-- Pregunta 38
(38, 'Un registro individual', FALSE),
(38, 'La llave primaria de la tabla', FALSE),
(38, 'Un atributo que todos los registros comparten, como el email', TRUE),
(38, 'El total de filas de la tabla', FALSE),

-- Pregunta 39
(39, 'El primer dato que se insertó en la tabla', FALSE),
(39, 'La columna más importante para el usuario', FALSE),
(39, 'Una contraseña para entrar a la tabla', FALSE),
(39, 'Un valor único que identifica cada fila sin ambigüedad', TRUE),

-- Pregunta 40
(40, 'Porque los nombres pueden repetirse entre personas distintas', TRUE),
(40, 'Porque los nombres son demasiado largos', FALSE),
(40, 'Porque las letras no se pueden guardar en una base de datos', FALSE),
(40, 'Porque los nombres cambian todos los días', FALSE),

-- Pregunta 41
(41, 'La primera columna de cualquier tabla', FALSE),
(41, 'Una columna que guarda la llave primaria de otra tabla', TRUE),
(41, 'Una copia de seguridad de la tabla', FALSE),
(41, 'Una llave que abre la base de datos', FALSE),

-- Pregunta 42
(42, 'Muchos a muchos: cualquier lección pertenece a varios cursos', FALSE),
(42, 'Uno a uno: cada curso tiene exactamente una lección', FALSE),
(42, 'Uno a muchos: un curso tiene muchas lecciones y cada lección un solo curso', TRUE),
(42, 'No existe relación entre cursos y lecciones', FALSE),

-- Pregunta 43
(43, 'La garantía de que las conexiones entre tablas siempre son válidas', TRUE),
(43, 'La velocidad con que se ejecutan las consultas', FALSE),
(43, 'El respaldo automático de los datos cada noche', FALSE),
(43, 'La cantidad de referencias que tiene una tabla', FALSE),

-- Pregunta 44
(44, 'La lección se crea pero queda oculta', FALSE),
(44, 'La base de datos crea el curso automáticamente', FALSE),
(44, 'La lección se guarda sin curso asignado', FALSE),
(44, 'La base de datos rechaza la operación', TRUE),

-- Pregunta 45
(45, 'Para pedir datos: indica qué columnas traer y de qué tabla', TRUE),
(45, 'Para borrar registros de una tabla', FALSE),
(45, 'Para crear tablas nuevas', FALSE),
(45, 'Para cambiar la contraseña de la base de datos', FALSE),

-- Pregunta 46
(46, 'Ordena los resultados alfabéticamente', FALSE),
(46, 'Filtra: solo devuelve las filas que cumplen la condición', TRUE),
(46, 'Cuenta cuántas filas hay en la tabla', FALSE),
(46, 'Une dos tablas en una sola', FALSE),

-- Pregunta 47
(47, 'SELECT basico FROM nivel WHERE cursos', FALSE),
(47, 'SELECT * FROM cursos ORDER BY basico', FALSE),
(47, 'SELECT * FROM cursos WHERE nivel = ''basico''', TRUE),
(47, 'SELECT nivel FROM basico', FALSE),

-- Pregunta 48
(48, 'Que hay que declarar las variables antes de usarlas', FALSE),
(48, 'Que solo funciona declarando la versión de SQL', FALSE),
(48, 'Que describes QUÉ quieres y el motor decide CÓMO buscarlo', TRUE),
(48, 'Que las consultas deben leerse en voz alta', FALSE),

-- Pregunta 49
(49, 'Imprime documentos en la impresora', FALSE),
(49, 'Muestra mensajes o valores en pantalla', TRUE),
(49, 'Guarda el programa en el disco', FALSE),
(49, 'Detiene la ejecución del programa', FALSE),

-- Pregunta 50
(50, 'En orden alfabético', FALSE),
(50, 'Todas las líneas al mismo tiempo', FALSE),
(50, 'De abajo hacia arriba', FALSE),
(50, 'De arriba hacia abajo, línea por línea', TRUE),

-- Pregunta 51
(51, 'Porque es el lenguaje más antiguo que existe', FALSE),
(51, 'Porque su sintaxis clara permite concentrarse en la lógica', TRUE),
(51, 'Porque solo sirve para hacer páginas web', FALSE),
(51, 'Porque no permite cometer errores', FALSE),

-- Pregunta 52
(52, 'El pseudocódigo se ejecuta más rápido que Python', FALSE),
(52, 'No tienen ninguna relación', FALSE),
(52, 'Programar es traducir esa lógica a un idioma que la máquina entiende', TRUE),
(52, 'Python no puede expresar condicionales del pseudocódigo', FALSE),

-- Pregunta 53
(53, 'Asignándole un valor con el signo igual: edad = 25', TRUE),
(53, 'Declarando su tipo con la palabra var', FALSE),
(53, 'Escribiendo su nombre en mayúsculas', FALSE),
(53, 'Pidiéndola con la función print()', FALSE),

-- Pregunta 54
(54, 'int', FALSE),
(54, 'str', FALSE),
(54, 'float', TRUE),
(54, 'bool', FALSE),

-- Pregunta 55
(55, '5', FALSE),
(55, '"23"', TRUE),
(55, 'Un error de sintaxis', FALSE),
(55, '6', FALSE),

-- Pregunta 56
(56, 'int', FALSE),
(56, 'float', FALSE),
(56, 'str', FALSE),
(56, 'bool', TRUE),

-- Pregunta 57
(57, 'Repite un bloque de código varias veces', FALSE),
(57, 'Ejecuta un bloque solo si su condición es verdadera', TRUE),
(57, 'Define una variable nueva', FALSE),
(57, 'Termina el programa inmediatamente', FALSE),

-- Pregunta 58
(58, 'Ejecuta el camino alternativo cuando la condición del if es falsa', TRUE),
(58, 'Repite el if hasta que sea verdadero', FALSE),
(58, 'Comprueba una segunda condición obligatoria', FALSE),
(58, 'Detiene el programa si hay un error', FALSE),

-- Pregunta 59
(59, 'Es solo decoración para leer mejor el código', FALSE),
(59, 'Hace que el programa se ejecute más rápido', FALSE),
(59, 'Define qué instrucciones pertenecen a cada bloque', TRUE),
(59, 'Es opcional en los condicionales', FALSE),

-- Pregunta 60
(60, 'Cuando al menos una condición es verdadera', FALSE),
(60, 'Cuando ambas condiciones son falsas', FALSE),
(60, 'Siempre, sin importar las condiciones', FALSE),
(60, 'Solo cuando ambas condiciones son verdaderas', TRUE),

-- Pregunta 61
(61, '1, 2, 3, 4 y 5', FALSE),
(61, '0, 1, 2, 3 y 4', TRUE),
(61, '0, 1, 2, 3, 4 y 5', FALSE),
(61, 'Cinco valores aleatorios', FALSE),

-- Pregunta 62
(62, 'Cuando el ciclo debe ejecutarse exactamente 10 veces', FALSE),
(62, 'Cuando no se sabe de antemano cuántas repeticiones harán falta', TRUE),
(62, 'Cuando se recorre una lista de principio a fin', FALSE),
(62, 'Nunca: while está obsoleto', FALSE),

-- Pregunta 63
(63, 'Un ciclo que se ejecuta una sola vez', FALSE),
(63, 'Un ciclo dentro de otro ciclo', FALSE),
(63, 'Un while cuya condición nunca se vuelve falsa', TRUE),
(63, 'Un for que recorre una lista vacía', FALSE),

-- Pregunta 64
(64, 'Que use la menor cantidad de variables posible', FALSE),
(64, 'Que en cada vuelta se acerque a su condición de salida', TRUE),
(64, 'Que imprima un mensaje en cada repetición', FALSE),
(64, 'Que nunca use la instrucción while', FALSE),

-- Pregunta 65
(65, 'Escribir código de inmediato para no perder tiempo', FALSE),
(65, 'Buscar una solución parecida en internet', FALSE),
(65, 'Entender el problema: entradas, salida y casos especiales', TRUE),
(65, 'Elegir el lenguaje de programación', FALSE),

-- Pregunta 66
(66, 'Porque los pasos que sigues manualmente SON el algoritmo', TRUE),
(66, 'Porque así se evita usar la computadora', FALSE),
(66, 'Porque los ejemplos pequeños no tienen errores', FALSE),
(66, 'Porque es más divertido que programar', FALSE),

-- Pregunta 67
(67, 'Resolverlo demasiado rápido', FALSE),
(67, 'No poder explicarlo simple con tus propias palabras', TRUE),
(67, 'Necesitar papel y lápiz para pensarlo', FALSE),
(67, 'Que el problema tenga varios casos especiales', FALSE),

-- Pregunta 68
(68, 'Apenas se conoce el enunciado del problema', FALSE),
(68, 'Cuando el plan de solución ya está claro en papel', TRUE),
(68, 'Después de entregar el proyecto', FALSE),
(68, 'Cuando alguien más ya escribió la mitad', FALSE),

-- Pregunta 69
(69, 'En partir un problema grande en subproblemas pequeños', TRUE),
(69, 'En eliminar las partes difíciles del problema', FALSE),
(69, 'En escribir el código en varios archivos', FALSE),
(69, 'En resolver varios problemas al mismo tiempo', FALSE),

-- Pregunta 70
(70, 'Ser más grande que el problema original', FALSE),
(70, 'Resolver varias cosas a la vez para ahorrar tiempo', FALSE),
(70, 'Tener una responsabilidad clara y única', TRUE),
(70, 'No relacionarse con los demás subproblemas', FALSE),

-- Pregunta 71
(71, 'Permite repartir piezas entre personas y probarlas por separado', TRUE),
(71, 'Obliga a que todos trabajen en el mismo archivo', FALSE),
(71, 'Elimina la necesidad de hacer pruebas', FALSE),
(71, 'Hace innecesaria la comunicación del equipo', FALSE),

-- Pregunta 72
(72, 'Porque las plataformas son imposibles de construir', FALSE),
(72, 'Porque los formularios no requieren lógica', FALSE),
(72, 'Porque la mente trabaja mejor con problemas acotados', TRUE),
(72, 'Porque validar formularios no es programación real', FALSE),

-- Pregunta 73
(73, 'Un error que se repite en el código', FALSE),
(73, 'Una estructura de solución que se repite en problemas distintos', TRUE),
(73, 'Un diseño visual para las interfaces', FALSE),
(73, 'Una regla de sintaxis de los lenguajes', FALSE),

-- Pregunta 74
(74, 'El patrón de búsqueda del mínimo', FALSE),
(74, 'El patrón de conteo de elementos', FALSE),
(74, 'El patrón de ordenamiento alfabético', FALSE),
(74, 'El patrón de máximo: recorrer guardando el mayor valor visto', TRUE),

-- Pregunta 75
(75, 'Escribir la solución en varios lenguajes', FALSE),
(75, 'Resolver la versión amplia del problema, no solo un caso puntual', TRUE),
(75, 'Hacer la solución más larga y detallada', FALSE),
(75, 'Copiar la solución de otro problema sin cambios', FALSE),

-- Pregunta 76
(76, 'Los problemas nuevos se ven como combinaciones de problemas resueltos', TRUE),
(76, 'Ya no hace falta entender los problemas', FALSE),
(76, 'Todos los problemas se vuelven idénticos', FALSE),
(76, 'Se puede programar sin pensar', FALSE),

-- Pregunta 77
(77, 'La cantidad de líneas de código que usa', FALSE),
(77, 'Cómo crece su trabajo cuando crece el tamaño de la entrada', TRUE),
(77, 'La cantidad de memoria RAM del computador', FALSE),
(77, 'El número de programadores que lo escribieron', FALSE),

-- Pregunta 78
(78, 'Porque descarta la mitad de las opciones en cada paso', TRUE),
(78, 'Porque lee las páginas más rápido', FALSE),
(78, 'Porque usa dos computadoras a la vez', FALSE),
(78, 'Porque memoriza el diccionario completo', FALSE),

-- Pregunta 79
(79, 'Que la lista tenga menos de cien elementos', FALSE),
(79, 'Que los datos estén desordenados', FALSE),
(79, 'Que los datos estén ordenados', TRUE),
(79, 'Que la búsqueda se haga en papel', FALSE),

-- Pregunta 80
(80, 'No: si ambos son correctos, tardan exactamente lo mismo', FALSE),
(80, 'Sí, pero solo en computadores antiguos', FALSE),
(80, 'No: la eficiencia depende solo del lenguaje usado', FALSE),
(80, 'Sí: con datos grandes, uno puede tardar segundos y otro horas', TRUE);
