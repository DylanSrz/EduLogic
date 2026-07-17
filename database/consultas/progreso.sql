-- ============================================================
-- EduLogic — Consultas de progreso del estudiante
-- Equivalentes SQL de las consultas que ejecuta el servicio
-- backend/app/services/progreso.py con SQLAlchemy.
-- Evidencia de consultas funcionales (requisito del enunciado).
--
-- Reemplazar :usuario_id y :curso_id por valores reales al probar
-- en el SQL Editor de Supabase.
-- ============================================================


-- 1. Total de lecciones de un curso
SELECT COUNT(l.id) AS total_lecciones
FROM lecciones l
WHERE l.curso_id = :curso_id;


-- 2. Lecciones completadas por un usuario en un curso
SELECT COUNT(p.id) AS lecciones_completadas
FROM progreso p
JOIN lecciones l ON l.id = p.leccion_id
WHERE l.curso_id = :curso_id
  AND p.usuario_id = :usuario_id
  AND p.completada = TRUE;


-- 3. Lecciones de un curso con su estado para un usuario
--    (LEFT JOIN: las no completadas aparecen con completada = NULL -> false)
SELECT
    l.id,
    l.titulo,
    l.orden,
    COALESCE(p.completada, FALSE) AS completada
FROM lecciones l
LEFT JOIN progreso p
    ON p.leccion_id = l.id
    AND p.usuario_id = :usuario_id
WHERE l.curso_id = :curso_id
ORDER BY l.orden;


-- 4. Mejor puntaje del usuario por cuestionario
--    (MAX = la regla del motor de evaluacion: se guardan todos los
--    intentos y el progreso usa el mejor)
SELECT
    i.cuestionario_id,
    MAX(i.puntaje) AS mejor_puntaje
FROM intentos i
WHERE i.usuario_id = :usuario_id
GROUP BY i.cuestionario_id;


-- 5. Resumen global: cursos con actividad del usuario y su porcentaje
SELECT
    c.id,
    c.titulo,
    c.nivel,
    COUNT(DISTINCT l.id) AS total_lecciones,
    COUNT(DISTINCT p.id) AS lecciones_completadas,
    ROUND(COUNT(DISTINCT p.id)::numeric / COUNT(DISTINCT l.id) * 100, 1) AS porcentaje
FROM cursos c
JOIN lecciones l ON l.curso_id = c.id
LEFT JOIN progreso p
    ON p.leccion_id = l.id
    AND p.usuario_id = :usuario_id
WHERE c.id IN (
    -- solo cursos donde el usuario tiene al menos una leccion completada
    SELECT DISTINCT l2.curso_id
    FROM progreso p2
    JOIN lecciones l2 ON l2.id = p2.leccion_id
    WHERE p2.usuario_id = :usuario_id
)
GROUP BY c.id, c.titulo, c.nivel;
