--------------------------------------------------------
-- USUARIOS
--------------------------------------------------------

INSERT INTO usuarios
(nombre,email,contrasena_hash,rol)
VALUES
('Administrador General',
'admin@edulogic.com',
'$2b$12$HASH_ADMIN_PENDIENTE',
'admin'),

('Juan Pérez',
'juan@edulogic.com',
'$2b$12$HASH_PROFESOR1_PENDIENTE',
'profesor'),

('Laura Gómez',
'laura@edulogic.com',
'$2b$12$HASH_PROFESOR2_PENDIENTE',
'profesor'),

('Carlos Rodríguez',
'carlos@gmail.com',
'$2b$12$HASH_ESTUDIANTE1_PENDIENTE',
'estudiante'),

('Ana Martínez',
'ana@gmail.com',
'$2b$12$HASH_ESTUDIANTE2_PENDIENTE',
'estudiante'),

('Luis Torres',
'luis@gmail.com',
'$2b$12$HASH_ESTUDIANTE3_PENDIENTE',
'estudiante');

--------------------------------------------------------
-- CURSOS
--------------------------------------------------------

INSERT INTO cursos
(titulo,descripcion,nivel,creador_id)
VALUES

(
'Lógica de Programación desde Cero',
'Curso introductorio donde aprenderás a resolver problemas utilizando algoritmos, diagramas de flujo y pseudocódigo antes de comenzar a programar.',
'basico',
2
),

(
'Matemáticas Básicas para Programadores',
'Curso orientado a fortalecer el pensamiento lógico mediante operaciones matemáticas, álgebra y razonamiento aplicado a la programación.',
'basico',
3
);

--------------------------------------------------------
-- LECCIONES
--------------------------------------------------------

INSERT INTO lecciones
(curso_id,titulo,contenido,orden)
VALUES

--------------------------------------------------------
-- CURSO 1
--------------------------------------------------------

(
1,
'¿Qué es la programación?',
'La programación consiste en crear instrucciones que una computadora puede ejecutar para resolver problemas. Todo programa está compuesto por una serie de pasos organizados de manera lógica.',
1
),

(
1,
'Algoritmos',
'Un algoritmo es una secuencia ordenada y finita de pasos que permite resolver un problema o realizar una tarea determinada.',
2
),

(
1,
'Diagramas de flujo',
'Los diagramas de flujo representan gráficamente un algoritmo mediante símbolos conectados por flechas para facilitar su comprensión.',
3
),

(
1,
'Pseudocódigo',
'El pseudocódigo permite escribir algoritmos utilizando un lenguaje cercano al lenguaje humano sin depender de un lenguaje de programación específico.',
4
),

--------------------------------------------------------
-- CURSO 2
--------------------------------------------------------

(
2,
'Números y operaciones',
'Repaso de suma, resta, multiplicación y división, operaciones fundamentales para resolver problemas computacionales.',
1
),

(
2,
'Jerarquía de operaciones',
'Aprenderás el orden correcto en el que deben resolverse las operaciones matemáticas utilizando la prioridad de operadores.',
2
),

(
2,
'Álgebra básica',
'Introducción al uso de variables y expresiones algebraicas para representar información de manera general.',
3
),

(
2,
'Razonamiento lógico',
'Desarrollo del pensamiento lógico mediante ejercicios que fortalecen la capacidad de análisis y resolución de problemas.',
4
);

--------------------------------------------------------
-- CUESTIONARIOS
--------------------------------------------------------

INSERT INTO cuestionarios
(leccion_id,titulo)
VALUES

(1,'Cuestionario: ¿Qué es la programación?'),

(2,'Cuestionario: Algoritmos'),

(3,'Cuestionario: Diagramas de flujo'),

(4,'Cuestionario: Pseudocódigo'),

(5,'Cuestionario: Números y operaciones'),

(6,'Cuestionario: Jerarquía de operaciones'),

(7,'Cuestionario: Álgebra básica'),

(8,'Cuestionario: Razonamiento lógico');

--------------------------------------------------------
-- PREGUNTAS
--------------------------------------------------------

INSERT INTO preguntas (cuestionario_id, enunciado, explicacion)
VALUES

-- CUESTIONARIO 1
(1,
'¿Qué es la programación?',
'La programación consiste en crear instrucciones para que una computadora resuelva problemas o realice tareas específicas.'),

(1,
'¿Cuál es el objetivo principal de un programa?',
'Todo programa busca resolver un problema o automatizar una tarea.'),

(1,
'¿Quién ejecuta las instrucciones escritas por un programador?',
'Las instrucciones son ejecutadas por la computadora mediante un lenguaje de programación.'),

-- CUESTIONARIO 2
(2,
'¿Qué es un algoritmo?',
'Un algoritmo es una secuencia ordenada de pasos para resolver un problema.'),

(2,
'¿Cómo debe ser un algoritmo?',
'Debe ser ordenado, finito y preciso para que pueda ejecutarse correctamente.'),

(2,
'¿Cuál de los siguientes representa mejor un algoritmo?',
'Un algoritmo describe una serie de pasos organizados para alcanzar un resultado.'),

-- CUESTIONARIO 3
(3,
'¿Para qué sirven los diagramas de flujo?',
'Permiten representar visualmente el proceso de un algoritmo.'),

(3,
'¿Qué representan las flechas en un diagrama de flujo?',
'Las flechas indican la dirección o secuencia del proceso.'),

(3,
'¿Qué símbolo representa normalmente una decisión?',
'El rombo representa una decisión porque permite evaluar una condición.'),

-- CUESTIONARIO 4
(4,
'¿Qué es el pseudocódigo?',
'Es una forma de escribir algoritmos utilizando un lenguaje sencillo y estructurado.'),

(4,
'¿Cuál es una ventaja del pseudocódigo?',
'Permite diseñar la lógica antes de escribir código real.'),

(4,
'¿El pseudocódigo depende de un lenguaje de programación específico?',
'No, puede entenderse independientemente del lenguaje que se utilice.');

--------------------------------------------------------
-- OPCIONES
--------------------------------------------------------

INSERT INTO opciones (pregunta_id,texto,es_correcta)
VALUES

--------------------------------------------------------
-- Pregunta 1
--------------------------------------------------------

(1,'Crear instrucciones para resolver problemas mediante una computadora',TRUE),
(1,'Diseñar únicamente páginas web',FALSE),
(1,'Reparar computadores',FALSE),
(1,'Instalar sistemas operativos',FALSE),
--------------------------------------------------------
-- Pregunta 2
--------------------------------------------------------

(2,'Resolver un problema o automatizar una tarea',TRUE),
(2,'Encender un computador',FALSE),
(2,'Conectarse a Internet',FALSE),
(2,'Guardar archivos únicamente',FALSE),

--------------------------------------------------------
-- Pregunta 3
--------------------------------------------------------

(3,'La computadora',TRUE),
(3,'El monitor',FALSE),
(3,'El teclado',FALSE),
(3,'El usuario',FALSE),

--------------------------------------------------------
-- Pregunta 4
--------------------------------------------------------

(4,'Una secuencia ordenada de pasos',TRUE),
(4,'Un lenguaje de programación',FALSE),
(4,'Un sistema operativo',FALSE),
(4,'Un navegador web',FALSE),

--------------------------------------------------------
-- Pregunta 5
--------------------------------------------------------

(5,'Ordenado, preciso y finito',TRUE),
(5,'Muy largo',FALSE),
(5,'Escrito únicamente en inglés',FALSE),
(5,'Complicado de entender',FALSE),

--------------------------------------------------------
-- Pregunta 6
--------------------------------------------------------

(6,'Una receta de cocina con pasos claros',TRUE),
(6,'Una fotografía',FALSE),
(6,'Una canción',FALSE),
(6,'Una base de datos',FALSE),

--------------------------------------------------------
-- Pregunta 7
--------------------------------------------------------

(7,'Representar visualmente un algoritmo',TRUE),
(7,'Escribir código HTML',FALSE),
(7,'Diseñar bases de datos',FALSE),
(7,'Crear videojuegos',FALSE),

--------------------------------------------------------
-- Pregunta 8
--------------------------------------------------------

(8,'La dirección del flujo del proceso',TRUE),
(8,'El inicio del algoritmo',FALSE),
(8,'El color del diagrama',FALSE),
(8,'Los errores del programa',FALSE),

--------------------------------------------------------
-- Pregunta 9
--------------------------------------------------------

(9,'Un rombo',TRUE),
(9,'Un rectángulo',FALSE),
(9,'Un círculo',FALSE),
(9,'Una flecha',FALSE),

--------------------------------------------------------
-- Pregunta 10
--------------------------------------------------------

(10,'Una descripción estructurada de un algoritmo',TRUE),
(10,'Un programa compilado',FALSE),
(10,'Una base de datos',FALSE),
(10,'Un lenguaje de programación',FALSE),

--------------------------------------------------------
-- Pregunta 11
--------------------------------------------------------

(11,'Facilita diseñar la lógica antes de programar',TRUE),
(11,'Hace el programa más rápido automáticamente',FALSE),
(11,'Reemplaza cualquier lenguaje de programación',FALSE),
(11,'Elimina todos los errores',FALSE),

--------------------------------------------------------
-- Pregunta 12
--------------------------------------------------------

(12,'No depende de un lenguaje específico',TRUE),
(12,'Solo sirve para Java',FALSE),
(12,'Solo sirve para Python',FALSE),
(12,'Debe compilarse para ejecutarse',FALSE);

--------------------------------------------------------
-- PREGUNTAS
--------------------------------------------------------

INSERT INTO preguntas (cuestionario_id, enunciado, explicacion)
VALUES

-- CUESTIONARIO 5 - Números y operaciones

(5,
'¿Cuál de las siguientes es una operación matemática básica?',
'La suma hace parte de las cuatro operaciones fundamentales de las matemáticas.'),

(5,
'¿Cuál es el resultado de 8 × 5?',
'Multiplicar 8 por 5 da como resultado 40.'),

(5,
'¿Qué operación representa el símbolo "/"?',
'El símbolo "/" representa la división.'),

-- CUESTIONARIO 6 - Jerarquía de operaciones

(6,
'¿Qué operación tiene prioridad en 5 + 3 × 2?',
'La multiplicación siempre se resuelve antes que la suma.'),

(6,
'¿Qué se resuelve primero cuando existen paréntesis?',
'Los paréntesis siempre tienen la mayor prioridad.'),

(6,
'¿Cuál es el resultado de (6 + 2) × 3?',
'Primero se resuelve el paréntesis y luego la multiplicación.'),

-- CUESTIONARIO 7 - Álgebra básica

(7,
'¿Qué representa normalmente una variable?',
'Una variable almacena un valor que puede cambiar.'),

(7,
'¿Qué letra suele utilizarse para representar una incógnita?',
'La letra x es la más utilizada para representar una incógnita.'),

(7,
'Si x = 5, ¿cuánto vale x + 3?',
'Solo debes reemplazar el valor de x y realizar la operación.'),

-- CUESTIONARIO 8 - Razonamiento lógico

(8,
'¿Qué habilidad fortalece el razonamiento lógico?',
'Permite analizar problemas y encontrar soluciones paso a paso.'),

(8,
'¿Cuál de las siguientes acciones demuestra pensamiento lógico?',
'Evaluar distintas alternativas antes de tomar una decisión.'),

(8,
'¿Por qué es importante el razonamiento lógico en programación?',
'Porque ayuda a diseñar soluciones eficientes para resolver problemas.');

--------------------------------------------------------
-- OPCIONES
--------------------------------------------------------

INSERT INTO opciones (pregunta_id, texto, es_correcta)
VALUES

--------------------------------------------------------
-- Pregunta 13
--------------------------------------------------------

(13,'La suma',TRUE),
(13,'El dibujo',FALSE),
(13,'La lectura',FALSE),
(13,'La escritura',FALSE),

--------------------------------------------------------
-- Pregunta 14
--------------------------------------------------------

(14,'40',TRUE),
(14,'35',FALSE),
(14,'45',FALSE),
(14,'48',FALSE),

--------------------------------------------------------
-- Pregunta 15
--------------------------------------------------------

(15,'La división',TRUE),
(15,'La suma',FALSE),
(15,'La resta',FALSE),
(15,'La multiplicación',FALSE),

--------------------------------------------------------
-- Pregunta 16
--------------------------------------------------------

(16,'La multiplicación',TRUE),
(16,'La suma',FALSE),
(16,'La resta',FALSE),
(16,'La división',FALSE),

--------------------------------------------------------
-- Pregunta 17
--------------------------------------------------------

(17,'Los paréntesis',TRUE),
(17,'La suma',FALSE),
(17,'La resta',FALSE),
(17,'El resultado final',FALSE),

--------------------------------------------------------
-- Pregunta 18
--------------------------------------------------------

(18,'24',TRUE),
(18,'18',FALSE),
(18,'16',FALSE),
(18,'30',FALSE),

--------------------------------------------------------
-- Pregunta 19
--------------------------------------------------------

(19,'Un valor que puede cambiar',TRUE),
(19,'Una operación matemática',FALSE),
(19,'Un lenguaje de programación',FALSE),
(19,'Un símbolo de multiplicación',FALSE),

--------------------------------------------------------
-- Pregunta 20
--------------------------------------------------------

(20,'x',TRUE),
(20,'z',FALSE),
(20,'m',FALSE),
(20,'k',FALSE),

--------------------------------------------------------
-- Pregunta 21
--------------------------------------------------------

(21,'8',TRUE),
(21,'5',FALSE),
(21,'15',FALSE),
(21,'3',FALSE),

--------------------------------------------------------
-- Pregunta 22
--------------------------------------------------------

(22,'Analizar problemas antes de resolverlos',TRUE),
(22,'Memorizar códigos sin comprenderlos',FALSE),
(22,'Escribir muy rápido',FALSE),
(22,'Usar siempre la misma solución',FALSE),

--------------------------------------------------------
-- Pregunta 23
--------------------------------------------------------

(23,'Comparar varias alternativas antes de decidir',TRUE),
(23,'Elegir la primera opción sin pensar',FALSE),
(23,'Copiar la solución de otra persona',FALSE),
(23,'Evitar analizar el problema',FALSE),

--------------------------------------------------------
-- Pregunta 24
--------------------------------------------------------

(24,'Porque permite diseñar soluciones eficientes',TRUE),
(24,'Porque hace que el computador sea más rápido',FALSE),
(24,'Porque elimina todos los errores automáticamente',FALSE),
(24,'Porque reemplaza los lenguajes de programación',FALSE);

--------------------------------------------------------
-- INTENTOS
--------------------------------------------------------

INSERT INTO intentos
(usuario_id, cuestionario_id, puntaje)
VALUES

-- Carlos
(4,1,100.00),
(4,2,66.67),
(4,3,100.00),

-- Ana
(5,1,66.67),
(5,5,100.00),

-- Luis
(6,2,33.33),
(6,7,100.00);

--------------------------------------------------------
-- RESPUESTAS DE LOS INTENTOS
--------------------------------------------------------

INSERT INTO respuestas_intento
(intento_id,pregunta_id,opcion_elegida_id)
VALUES

--------------------------------------------------------
-- Intento 1 (Carlos - Quiz 1)
--------------------------------------------------------

(1,1,1),
(1,2,5),
(1,3,9),

--------------------------------------------------------
-- Intento 2 (Carlos - Quiz 2)
--------------------------------------------------------

(2,4,13),
(2,5,18), -- Incorrecta (correcta = 17)
(2,6,21),

--------------------------------------------------------
-- Intento 3 (Carlos - Quiz 3)
--------------------------------------------------------

(3,7,25),
(3,8,29),
(3,9,33),

--------------------------------------------------------
-- Intento 4 (Ana - Quiz 1)
--------------------------------------------------------

(4,1,2), -- Incorrecta
(4,2,5),
(4,3,9),

--------------------------------------------------------
-- Intento 5 (Ana - Quiz 5)
--------------------------------------------------------

(5,13,49),
(5,14,53),
(5,15,57),

--------------------------------------------------------
-- Intento 6 (Luis - Quiz 2)
--------------------------------------------------------

(6,4,16), -- Incorrecta
(6,5,18), -- Incorrecta
(6,6,24), -- Incorrecta

--------------------------------------------------------
-- Intento 7 (Luis - Quiz 7)
--------------------------------------------------------

(7,19,73),
(7,20,77),
(7,21,81);

--------------------------------------------------------
-- PROGRESO
--------------------------------------------------------

INSERT INTO progreso
(usuario_id,leccion_id,completada)
VALUES

-- Carlos
(4,1,true),
(4,2,true),
(4,3,true),
(4,4,false),

-- Ana
(5,1,true),
(5,2,false),
(5,5,true),

-- Luis
(6,1,false),
(6,2,true),
(6,7,true),
(6,8,false);

