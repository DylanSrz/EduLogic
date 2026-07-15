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

> **Nota:** Actualmente este paso no es necesario, ya que la base de datos del proyecto ya contiene los datos semilla.

## Resultado

* Todas las tablas quedan pobladas correctamente.
* No se presentan errores de claves foráneas.
* La base de datos dispone de información suficiente para realizar pruebas, consultas y operaciones de manipulación.

## Issue relacionada

Issue [#13](https://github.com/DylanSrz/EduLogic/issues/13)
