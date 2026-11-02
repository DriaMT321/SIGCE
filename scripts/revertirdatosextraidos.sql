-- ==============================================================================
-- SCRIPT SQL DE REVERSIÓN / ROLLBACK DE DATOS EXTRAÍDOS
-- Elimina matrículas, estudiantes, docentes y cuentas docentes, preservando admin
-- ==============================================================================

BEGIN;

-- 1. Eliminar matrículas de estudiantes
DELETE FROM "enrollments";

-- 2. Eliminar estudiantes
DELETE FROM "students";

-- 3. Eliminar asignaciones y docentes
DELETE FROM "teacher_subjects";
DELETE FROM "teachers";

-- 4. Eliminar cuentas de usuarios con rol TEACHER (preserva administradores)
DELETE FROM "users" WHERE "role" = 'TEACHER';

-- 5. Eliminar cursos
DELETE FROM "courses";

COMMIT;
