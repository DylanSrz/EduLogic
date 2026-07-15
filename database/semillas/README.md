# Implementación de datos semilla

## Descripción

En esta issue se implementó un archivo SQL con los **datos semilla** del proyecto, los cuales permiten poblar la base de datos con información inicial necesaria para el desarrollo, las pruebas y la validación del sistema.

## Cambios realizados

* Se creó el archivo `database/semillas/datos_semilla.sql`.
* Se añadieron sentencias `INSERT` para las siguientes tablas:

  * usuarios
  * cursos
  * lecciones
  * cuestionarios
  * preguntas
  * opciones
  * intentos
  * respuestas_intento
  * progreso
* Se respetó el orden de inserción de los registros de acuerdo con las relaciones entre las tablas, comenzando por `usuarios`.
* Las contraseñas de los usuarios semilla fueron hasheadas utilizando la función de seguridad implementada en el backend antes de ser insertadas en la tabla `usuarios`.

## Consideraciones

* Los datos fueron diseñados únicamente para el desarrollo y las pruebas del proyecto **EduLogic**.
* Se respetan las restricciones de claves primarias y foráneas para garantizar la integridad referencial.

## Ejecución del script

Si se requiere volver a poblar la base de datos:

1. Acceder al proyecto **EduLogic** en Supabase.
2. Abrir el **SQL Editor**.
3. Copiar y ejecutar el contenido del archivo `database/semillas/datos_semilla.sql`.

⚠️ Este script solo debe ejecutarse sobre una base de datos limpia (sin datos previos en las tablas). Los INSERT dependen de que los IDs autoincrementales comiencen en 1; sobre una base con datos, las referencias entre tablas quedarían apuntando a registros equivocados. Para reejecutarlo, primero limpiar las tablas en el orden indicado en la sección "Limpieza de datos".

## Resultado

* Todas las tablas quedan pobladas correctamente.
* No se presentan errores de claves foráneas.
* La base de datos dispone de información suficiente para realizar pruebas, consultas y operaciones de manipulación.

## Limpieza de datos

Si es necesario eliminar los datos semilla, las tablas deben limpiarse en el orden inverso al de inserción para respetar las restricciones de claves foráneas.

Orden recomendado:

1. progreso
2. respuestas_intento
3. intentos
4. opciones
5. preguntas
6. cuestionarios
7. lecciones
8. cursos
9. usuarios

La limpieza puede realizarse mediante sentencias `DELETE` o `TRUNCATE`, según las necesidades del entorno y las restricciones definidas en la base de datos.

## Issue relacionada

Issue [#13](https://github.com/DylanSrz/EduLogic/issues/13)
