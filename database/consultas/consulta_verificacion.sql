SELECT
    c.id AS curso_id,
    c.titulo AS curso,
    l.id AS leccion_id,
    l.titulo AS leccion,
    q.id AS cuestionario_id,
    q.titulo AS cuestionario,
    p.id AS pregunta_id,
    p.enunciado
FROM cursos c
INNER JOIN lecciones l
    ON c.id = l.curso_id
INNER JOIN cuestionarios q
    ON l.id = q.leccion_id
INNER JOIN preguntas p
    ON q.id = p.cuestionario_id
WHERE c.id = 1
ORDER BY l.orden, p.id;