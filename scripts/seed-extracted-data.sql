-- ==============================================================================
-- SCRIPT SQL DE INYECCIÓN DE DATOS EXTRAÍDOS (SIGCE / SIE 2026)
-- Cursos (30), Docentes (34), Estudiantes (874) y Matrículas (874)
-- ==============================================================================

BEGIN;

DO $$
DECLARE
    v_year_id UUID;
    v_user_id UUID;
    v_course_id UUID;
    v_student_id UUID;
    v_pass_hash TEXT := '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bB8F1K1x7aZ6iT8w6hW1v8C1mQ1G'; -- Docente2026!
BEGIN
    SELECT id INTO v_year_id FROM academic_years WHERE year = 2026 LIMIT 1;
    IF v_year_id IS NULL THEN
        RAISE EXCEPTION 'Gestión Académica 2026 no encontrada. Ejecute primero db:setup';
    END IF;

    -- 1. Cursos
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Inicial en Familia Comunitaria - Primero A', 1, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Inicial en Familia Comunitaria - Primero B', 1, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Inicial en Familia Comunitaria - Primero C', 1, 'C', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Inicial en Familia Comunitaria - Segundo A', 2, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Inicial en Familia Comunitaria - Segundo B', 2, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Primero A', 3, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Primero B', 3, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Segundo A', 4, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Segundo B', 4, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Tercero A', 5, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Tercero B', 5, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Cuarto A', 6, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Cuarto B', 6, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Quinto A', 7, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Quinto B', 7, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Sexto A', 8, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Primaria Comunitaria Vocacional - Sexto B', 8, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Primero A', 9, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Primero B', 9, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Segundo A', 10, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Segundo B', 10, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Tercero A', 11, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Tercero B', 11, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Cuarto A', 12, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Cuarto B', 12, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Cuarto C', 12, 'C', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Quinto A', 13, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Quinto B', 13, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Sexto A', 14, 'A', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;
    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, 'Secundaria Comunitaria Productiva - Sexto B', 14, 'B', 'MORNING', 45, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;

    -- 2. Docentes y Usuarios

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.3918213@sigce.edu.bo', v_pass_hash, 'MAURA MARILUZ', 'ALVAREZ ROJAS', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '3918213', 'MAURA MARILUZ', 'ALVAREZ ROJAS', 'MAESTRA/O', '1', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.7719934@sigce.edu.bo', v_pass_hash, 'ERIKA', 'APONTE LEON', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '7719934', 'ERIKA', 'APONTE LEON', 'MAESTRA/O', '2', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.5886798@sigce.edu.bo', v_pass_hash, 'IVETH VANESSA', 'ARIAS ROJAS', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '5886798', 'IVETH VANESSA', 'ARIAS ROJAS', 'MAESTRA/O', '3', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.1105826@sigce.edu.bo', v_pass_hash, 'ELIA', 'AVENDAÑO GONZALES', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '1105826', 'ELIA', 'AVENDAÑO GONZALES', 'MAESTRA/O', '4', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.3912782@sigce.edu.bo', v_pass_hash, 'TESORO MARITZA', 'CARDONA URIONA', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '3912782', 'TESORO MARITZA', 'CARDONA URIONA', 'MAESTRA/O', '5', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.4510795@sigce.edu.bo', v_pass_hash, 'ANGEL', 'CASTRO SOLIZ', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '4510795', 'ANGEL', 'CASTRO SOLIZ', 'MAESTRA/O', '6', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.6297973@sigce.edu.bo', v_pass_hash, 'JENNY', 'CRESPO ARNEZ', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '6297973', 'JENNY', 'CRESPO ARNEZ', 'MAESTRA/O', '7', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.7685586@sigce.edu.bo', v_pass_hash, 'JUAN CARLOS', 'CUELLAR HURTADO', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '7685586', 'JUAN CARLOS', 'CUELLAR HURTADO', 'MAESTRA/O', '8', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.6272851@sigce.edu.bo', v_pass_hash, 'RICHARD', 'ESPINOZA VACA', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '6272851', 'RICHARD', 'ESPINOZA VACA', 'MAESTRA/O', '9', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.5690439@sigce.edu.bo', v_pass_hash, 'BEYMAR', 'GALARZA MENDOZA', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '5690439', 'BEYMAR', 'GALARZA MENDOZA', 'MAESTRA/O', '10', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.4258830@sigce.edu.bo', v_pass_hash, 'EYENNIL', 'GALVEZ LINARES', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '4258830', 'EYENNIL', 'GALVEZ LINARES', 'MAESTRA/O', '11', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.5355944@sigce.edu.bo', v_pass_hash, 'EDITH', 'GARCIA VARGAS', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '5355944', 'EDITH', 'GARCIA VARGAS', 'MAESTRA/O', '12', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.6239502@sigce.edu.bo', v_pass_hash, 'HEYBER ADOLFO', 'GEMIO BLANCO', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '6239502', 'HEYBER ADOLFO', 'GEMIO BLANCO', 'MAESTRA/O', '13', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.5635215@sigce.edu.bo', v_pass_hash, 'JUAN JOSE', 'GONZALES OVANDO', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '5635215', 'JUAN JOSE', 'GONZALES OVANDO', 'MAESTRA/O', '14', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.5422475@sigce.edu.bo', v_pass_hash, 'CECILIA', 'HERRERA GUTIERREZ', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '5422475', 'CECILIA', 'HERRERA GUTIERREZ', 'MAESTRA/O', '15', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.7696194@sigce.edu.bo', v_pass_hash, 'MARCO ANTONIO', 'HUANCA POMA', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '7696194', 'MARCO ANTONIO', 'HUANCA POMA', 'MAESTRA/O', '16', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.12547694@sigce.edu.bo', v_pass_hash, 'MARCO ANTONIO', 'HUARANCA CONDORI', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '12547694', 'MARCO ANTONIO', 'HUARANCA CONDORI', 'MAESTRA/O', '17', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.3061834@sigce.edu.bo', v_pass_hash, 'EDWIN', 'JIMENEZ CHOQUE', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '3061834', 'EDWIN', 'JIMENEZ CHOQUE', 'MAESTRA/O', '18', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.5357970@sigce.edu.bo', v_pass_hash, 'ANA LAURENCIA', 'LUNA MONTERO', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '5357970', 'ANA LAURENCIA', 'LUNA MONTERO', 'MAESTRA/O', '19', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.4571197@sigce.edu.bo', v_pass_hash, 'MARIELA', 'MENDEZ ARAMBELL', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '4571197', 'MARIELA', 'MENDEZ ARAMBELL', 'MAESTRA/O', '20', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.3850857@sigce.edu.bo', v_pass_hash, 'ROXANA', 'MENDUIÑA MENACHO', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '3850857', 'ROXANA', 'MENDUIÑA MENACHO', 'MAESTRA/O', '21', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.2982152@sigce.edu.bo', v_pass_hash, 'JUAN GERONIMO', 'ORTEGA UGARTE', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '2982152', 'JUAN GERONIMO', 'ORTEGA UGARTE', 'MAESTRA/O', '22', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.5641181@sigce.edu.bo', v_pass_hash, 'ZENAIDA', 'PADILLA KISPE', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '5641181', 'ZENAIDA', 'PADILLA KISPE', 'MAESTRA/O', '23', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.3188482@sigce.edu.bo', v_pass_hash, 'JUDITH', 'PEREZ BURGOS', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '3188482', 'JUDITH', 'PEREZ BURGOS', 'MAESTRA/O', '24', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.3913909@sigce.edu.bo', v_pass_hash, 'MARIA ROSARIO', 'PINTO MONTAÑO', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '3913909', 'MARIA ROSARIO', 'PINTO MONTAÑO', 'MAESTRA/O', '25', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.5725469@sigce.edu.bo', v_pass_hash, 'KELMA', 'RAMOS CALIZAYA', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '5725469', 'KELMA', 'RAMOS CALIZAYA', 'MAESTRA/O', '26', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.7675380@sigce.edu.bo', v_pass_hash, 'BRIGITH ROSSIO', 'ROBLES CADIMA', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '7675380', 'BRIGITH ROSSIO', 'ROBLES CADIMA', 'MAESTRA/O', '27', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.4629727@sigce.edu.bo', v_pass_hash, 'ANGELICA', 'ROJAS DELGADILLO', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '4629727', 'ANGELICA', 'ROJAS DELGADILLO', 'MAESTRA/O', '28', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.6258142@sigce.edu.bo', v_pass_hash, 'JOSE ANTONIO', 'SAAVEDRA CABEZAS', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '6258142', 'JOSE ANTONIO', 'SAAVEDRA CABEZAS', 'MAESTRA/O', '29', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.3193881@sigce.edu.bo', v_pass_hash, 'EDWIN', 'SUAREZ GILES', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '3193881', 'EDWIN', 'SUAREZ GILES', 'MAESTRA/O', '30', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.9717404@sigce.edu.bo', v_pass_hash, 'LIZET ROCIO', 'TERAN NUÑEZ', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '9717404', 'LIZET ROCIO', 'TERAN NUÑEZ', 'MAESTRA/O', '31', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.3879497@sigce.edu.bo', v_pass_hash, 'MAIDA', 'TORRICO ALVAREZ', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '3879497', 'MAIDA', 'TORRICO ALVAREZ', 'MAESTRA/O', '32', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.6388878@sigce.edu.bo', v_pass_hash, 'MARINA', 'VASQUEZ QUIROGA', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '6388878', 'MARINA', 'VASQUEZ QUIROGA', 'MAESTRA/O', '33', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), 'docente.6376460@sigce.edu.bo', v_pass_hash, 'SANDRA', 'VILLARROEL ESPINAL', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '6376460', 'SANDRA', 'VILLARROEL ESPINAL', 'MAESTRA/O', '34', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;

    -- 3. Estudiantes y Matrículas

    -- Curso: Inicial en Familia Comunitaria - Primero A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 1 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026504A', '16982273', 'ALEJANDRO', 'ALMANZA IBAÑEZ', '2021-10-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120261475', '16982282', 'LUCIA', 'ALMANZA IBAÑEZ', '2021-10-30', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026997', '16852692', 'AXA', 'ANDRADE RAMOS', '2021-07-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026305A', '17134573', 'SAMIR', 'AÑEZ ORTEGA', '2022-04-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120267873', '17202504', 'EMANUEL', 'ARIAS OLMOS', '2021-12-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026204', '17015806', 'JOSE MARIO', 'CALLEJAS PAEZ', '2021-09-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120266304', '17892185', 'ABRAHAM', 'COLQUE SACA', '2022-01-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120263380', '16850369', 'DANNY MAXIMILIANO', 'FLORES YAMPARA', '2021-07-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265831', '17418685', 'ABRIL', 'HERRERA RIVERO', '2022-04-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120268317', '17115660', 'ANDRES', 'HUASACE SANDOVAL', '2021-10-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120267747', '17413257', 'ABDIEL', 'JATACO CORDERO', '2021-10-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265763', '17580129', 'EMILIA SOFÍA', 'OSINAGA SUAREZ', '2022-04-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265364', '17472557', 'LUCAS JOSE', 'PARRAGA TITO', '2022-05-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120266612', '17534148', 'DYLAN MARIO', 'REYNOLDS SARAVIA', '2022-04-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265478', '16967068', 'CHRISTIANE', 'RIBERA AGUILERA', '2021-10-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026496', '17151231', 'DANIELA MASSIEL', 'RODRIGUEZ DORFELT', '2022-05-09', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120261150', '16838231', 'IRINA', 'ROJAS ARIAS', '2021-07-07', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120261293', '17127337', 'LUIS EDUARDO', 'ZAMBRANA PARADA', '2021-08-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Inicial en Familia Comunitaria - Primero B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 1 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120261880', '17159293', 'KEYNI', 'ARRAZOLA GONZALES', '2021-09-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120267234', '17510185', 'LUNET ALEXANDRA', 'AVILA PADILLA', '2022-05-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026678', '17230906', 'JOSIAS', 'CHOQUE GARABITO', '2022-06-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120261138', '17807178', 'DASHA ISABELLA', 'CUELLAR VILLARROEL', '2022-03-29', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026484A', '17300232', 'SARA GALEY', 'ESPINOZA CAÑARI', '2022-01-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120268563', '17221653', 'ZOE RENATA', 'FALDIN VACA', '2022-04-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120269224', '16995862', 'RAFAEL', 'HURTADO AYALA', '2021-11-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120263260', '17579196', 'LEONARDO', 'HURTADO GARCIA', '2022-02-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120263556', '17590484', 'SOFÍA VALENTINA', 'LAIME MEDINA', '2021-08-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120268631', '17151560', 'CHLOE ADHARA', 'LEYTON TORREZ', '2022-02-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120264058', '17135769', 'HAZARD YARCKO', 'MENDOZA TORREZ', '2021-12-31', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120263157', '17425568', 'EITHAN CIRO', 'MERCADO VACA', '2022-05-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120266778', '17396185', 'CAMILO', 'PEREIRA QUINTEROS', '2021-11-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981191202698A', '16891893', 'MAXIMILIANO', 'ROCHA CABRERA', '2021-08-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026609A', '16946577', 'VALENTINA', 'RODRIGUEZ BERRIOS', '2021-09-07', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120266207', '17315961', 'BRUNA AGUSTINA', 'RUIZ ROCHA', '2021-12-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981191202676', '18033481', 'FARAH', 'SALAZAR RODAS', '2022-01-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Inicial en Familia Comunitaria - Primero C
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 1 AND section = 'C' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120262558', '17402134', 'ISABEL CELESTE', 'ARIAS GALLARDO', '2022-02-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265461', '17205117', 'ANYHELO MATTEO', 'BUSTOS RODRIGUEZ', '2022-01-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120268871', '17514638', 'RANDY EDISON', 'CARDONA COSTALEITE', '2021-11-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120269503', '17142026', 'ISAIAS', 'CHARUPA ROBLES', '2021-08-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265517', '17313104', 'KHALED ADALID', 'ESCALANTE CESPEDES', '2022-06-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265387', '17814737', 'OLIVIA', 'GONZALES LINARES', '2021-07-29', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026998', '17214657', 'MONSERRAT', 'HAYES ALMENDRAS', '2022-06-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120263579', '17833447', 'SEBASTIAN ADRIEL', 'JIMENEZ RIBERA', '2021-12-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026607', '17298539', 'ZOE ANTONELLA', 'LEAÑOS ALVAREZ', '2021-12-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120267302', '18034799', 'MATEO GABRIEL', 'MENDOZA CORTEZ', '2022-02-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120262107', '17255876', 'MATIAS', 'OLIVA SUAREZ', '2022-02-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026999', '17299946', 'LUKA SANTIAGO', 'ORELLANA CARRASCO', '2022-06-29', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265176', '17535896', 'DANNA LUCIANA', 'PEÑA GUAZACE', '2022-03-30', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265740', '17437367', 'MADDY', 'RIBERA OVANDO', '2022-04-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120266658', '17222565', 'DANNA', 'RIVAS TERCEROS', '2022-06-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120264486', '17118387', 'LIA DENISSE', 'SANCHEZ ALVAREZ', '2021-10-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Inicial en Familia Comunitaria - Segundo A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 2 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912025172', '16464017', 'EDSON JARED', 'AGUILAR FLORES', '2020-07-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198166920257092', '16481069', 'MIA ISABELLA', 'CESPEDES REBOLLO', '2020-08-20', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120255986', '16469303', 'MATTHEW', 'CHOI BUCETA', '2020-07-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912025725', '16723004', 'ROLY JAIRO', 'CHOQUE CAMPOS', '2021-03-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198112120255624', '16498651', 'LAURA BELEN', 'CRUZ VACA', '2020-09-21', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120256618', '16596928', 'LUCIANA', 'DURI NAURO', '2020-12-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026120255650', 'S/CI-8198026120255650', 'ISAAC', 'LEON BLANCO', '2020-07-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120253431', '17227070', 'CAMILA MICHELLE', 'LLANQUE TAPIA', '2021-04-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120269720', '16696012', 'EUNICE', 'MELCHOR PALACHAY', '2021-02-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120256014', '16815613', 'VICTORIA', 'MOLINA FERNANDEZ', '2021-05-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120255113', '16767265', 'DEREK JACOB', 'MORALES MAMANI', '2021-04-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120259019', '16855001', 'THIAGO ZAID', 'OLMOS JATACO', '2021-05-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220256008', '17101672', 'SOPHIA', 'PANIAGUA ROJO', '2021-04-02', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120259817', '16469252', 'SUSAN', 'POQUECHOQUE AGREDA', '2020-07-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198101620258830', '16785258', 'DAFFNE', 'RODRIGUEZ MICO', '2021-04-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120259418', '16473485', 'NEHEMIAS MIGUEL', 'ROSALES BARRIOS', '2020-07-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120269617', '17508257', 'YEIKO', 'RUIZ RICALDIS', '2021-04-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912025512A', '16536543', 'THIAGO', 'STIPANCICH BRUZZO CASTRO', '2020-11-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120254109', '17192200', 'ALICE ARLET', 'TISCO ROJAS', '2021-04-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120265426', '16790253', 'ALEJANDRO', 'TORREZ MENDEZ', '2021-05-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Inicial en Familia Comunitaria - Segundo B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 2 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120256978', '16713802', 'FLAVIA FIORELA', 'ANGELO ZAPATA', '2021-03-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120256277', '16645379', 'ELEAZAR', 'BRAVO VEGA', '2021-01-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912026610A', '16645249', 'LIAM ARTURO', 'CUELLAR ARENAS', '2021-01-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120252524', '16794076', 'JARED', 'GONZALES BACHO', '2020-11-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120254543', '16627582', 'JESSICA BELEN', 'GUTIERREZ BARRIGA', '2021-01-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120261000', '16508186', 'ZOE DANIELA', 'GUTIERREZ COSTAS', '2020-10-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120252365', '16742074', 'FABRICIO', 'KILE LEON', '2021-03-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120259180', '16854996', 'ALYSSA', 'MARQUEZ MONTERO', '2021-04-07', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912025809', '16707082', 'PABLO MATEO', 'MENDOZA TERCEROS', '2021-02-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120255347', '16471645', 'ALIZ ROUSY', 'MERCADO VACA', '2020-07-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120255690', '16507838', 'IAN GABRIEL', 'MIRANDA CORTEZ', '2020-10-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198149220251731', '16723191', 'ESTER', 'QUITON REJAS', '2021-03-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120258403', '16603192', 'JAZIEL', 'ROCHA GUTIERREZ RAMIREZ', '2020-12-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120266914', '16728683', 'YOSSER AMIR', 'SALVATIERRA NOE', '2021-03-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120256192', '16766985', 'VICTOR BENJAMIN', 'SALVATIERRA SARAVIA', '2021-04-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120264560', '16699339', 'RENATO', 'SAUCEDO SANDOVAL', '2021-02-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120254595', '16759975', 'ANTONELLA', 'UNZUETA VARGAS', '2021-04-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912025789', '16466460', 'JOSEPH ALEXANDER', 'URQUIZU LOPEZ', '2020-07-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120269795', '16614103', 'AITANA', 'VACA VARGAS', '2020-12-29', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120268284', '16463746', 'YANINA', 'VACA VILLAGOMEZ', '2020-07-02', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912025939', '16733912', 'SAMUEL ANDRES', 'VERDUGUEZ GONZALES', '2021-03-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912025946A', '17734399', 'ALONSO YAHIR', 'ZORRILLA ORTUSTE', '2021-05-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Primero A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 3 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120242594', '16193166', 'ALINA', 'ARIAS OLMOS', '2019-10-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120244828', '16427827', 'CRISTIAN HASSAN', 'BALTAZAR TAPIA', '2020-03-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120257064', '16242280', 'NEITAN ALEXANDER', 'BAÑON GUZMAN', '2019-11-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198160320245647', '16120554', 'DANIEL LIEZER', 'CAMACHO CARDENAS', '2019-09-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372025220', '16039524', 'EYTAN EMANUEL', 'CASTRO HURTADO', '2019-07-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120249225', '16886902', 'EMILIANO', 'COIMBRA GUARDIA', '2019-12-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198025520246578', '16532020', 'ROLANDO DAVID', 'CONDORI ORTIZ', '2019-09-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198113420249251', '16899168', 'ISABELLA', 'CUELLAR MELGAR', '2019-09-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120244396', '16165437', 'JOSUE MARCELO', 'GUTIERREZ GIRONDA', '2019-07-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120242292', '17178155', 'ELIETTE NETANIA', 'MEDINA GONZALEZ', '2020-01-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120241920', '16879015', 'DYLAN MISAEL', 'MEJIA MUJICA', '2019-07-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120242662', '16223639', 'LUCIANA', 'RIBERA AGUILERA', '2019-10-28', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120243619', '16836434', 'NAHIARA', 'RODAS RIVERO', '2019-12-02', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120245644', '16051022', 'ELISA', 'ROMERO CALLAO', '2019-08-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980260202421A', '16072178', 'ABIGAIL', 'ROMERO VELASQUEZ', '2019-08-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120247628', '16237035', 'EMILIANA', 'RUIZ MONTAÑO', '2019-11-12', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120244925', '16428940', 'BRUNO', 'RUIZ SEJAS', '2020-03-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120257788', '16301697', 'ZOE ANGELINA', 'SANCHEZ USEDA', '2020-01-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912024930A', '16017406', 'JOAQUIN SANTIAGO', 'SARDINA CASIA', '2019-07-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198165920248689', '16237680', 'LUANA', 'SOLETO MENDEZ', '2019-11-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120248204', '16809341', 'SAMARA', 'SUAREZ AGUILERA', '2019-09-23', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912024686A', '16070870', 'ESTHER', 'SUAREZ MELGAR', '2019-08-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020244726', '16186551', 'ISABELLA ALESSANDRA', 'TORREZ DELGADILLO', '2019-10-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120249871', '16463069', 'VALERIA', 'TORREZ ROMERO', '2020-06-30', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020243916', '16042828', 'LUCIANA', 'VARGAS ZEBALLOS', '2019-07-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120247481', '16303180', 'ELENA', 'VELASCO SOTO', '2020-01-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120242383', '17364784', 'JOSUE MIGUEL', 'ZUÑIGA RAMIREZ', '2020-04-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Primero B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 3 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026820247939', '16374000', 'FABRICIO JEZIEL', 'ALI CALDERON', '2020-02-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120244464', '16042441', 'RAFAELLA SARA', 'ANGELO ZAPATA', '2019-07-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120249202', '16257865', 'RAPHAELA SARAHI', 'ANGLARILL FIGUEROA', '2019-12-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023920248464', '17276027', 'OSCAR', 'BELTRE RUA', '2019-08-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020245724', '16834801', 'LIAM ISAAC', 'BORDA URGEL', '2020-01-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981191202442', '16218049', 'EMILIANO FERNANDO', 'CABRERA ARANCIBIA', '2019-10-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120243193', '16175969', 'SARAH NAZARET', 'CAMACHO ADAUTO', '2019-10-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912024414A', '17585664', 'SOFIA ALESSANDRA', 'CARRILLO SOLANO', '2019-11-08', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020246408', '16042858', 'AXEL ABDIEL', 'CASALI FELIX', '2019-07-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120247293', '16424603', 'JHANS', 'CLAURE LLANOS', '2020-03-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120246049', '16799132', 'RASHELL SHERAZADE', 'CORONADO ROLDAN', '2020-01-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120246671', '16895930', 'ARIADNA KATRINE', 'CUELLAR VILLARROEL', '2020-02-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120241606', '16387611', 'TANIA YARETZI', 'CUELLAR VILLARROEL', '2020-02-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912024333A', '16149628', 'ALI', 'GONZALES RODRIGUEZ', '2019-09-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120241424', '16297220', 'DAMIAN', 'HERRERA RIVERO', '2019-12-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120245615', '16225273', 'SANTIAGO', 'HURTADO AYALA', '2019-10-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198012820243647', '16048379', 'ANDREA ELIS', 'LAIME MEDINA', '2019-07-28', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912024215A', '16305769', 'EDGAR JHASET', 'LEDEZMA CRUZ', '2020-01-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220248632', '16442292', 'GIANNA', 'MORON ULLOA', '2020-05-08', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120247144', '16340990', 'SEBASTIAN', 'MUÑOZ CUELLAR', '2020-01-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120243807', '16097282', 'URIEL', 'NAY GARCIA', '2019-08-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198155920246521', '16389777', 'EAN JOSUE', 'ORTIZ CEREZO', '2020-02-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220242474', '17101664', 'SANTINO', 'PANIAGUA ROJO', '2019-12-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198168920249389', '16452101', 'ALEXANDER', 'PEDRAZA CRUZ', '2020-06-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912024777', '16452718', 'PRISCILA YONELLY', 'RIOS ESTEVEZ', '2020-06-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020246346', '16345727', 'ELISA', 'RUIZ GUZMAN', '2020-01-23', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912024205', '16264367', 'SOPHIE ANTONELLA', 'SEMPERTEGUI COSSIO', '2019-12-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120242360', '16445542', 'KENDRA ADALET', 'VELEZ VIDAL', '2020-05-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Segundo A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 4 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120232428', '15350436', 'IAN SAMUEL', 'AÑEZ RUIZ', '2018-07-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198098220236541', '15803510', 'ZOE', 'ARANCIBIA CONDORI', '2019-04-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912023915', '15511673', 'EMMA ESTEFANIA', 'BRANER MOLINA', '2018-11-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802322023304A', '15853269', 'VICTORIA VALENTINA', 'CADIMA CABRERA', '2019-04-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120232674', '15441014', 'PRISCILA ROMINA', 'CHOQUE CAMPOS', '2018-10-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198151420236894', '15733072', 'EZEQUIEL', 'CRUZ VACA', '2019-03-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120235844', '15413855', 'LUCIANA', 'DAZA MOLINA', '2018-09-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120231812', '15918953', 'SOFIA', 'DAZA POGGI', '2019-05-28', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020232748', '16735099', 'SAMUEL', 'ESTRADA VELASCO', '2018-08-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120239169', '15806989', 'VALENTINA SARAHI', 'GUARDIA PADILLA', '2019-04-09', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912023820A', '15553380', 'AMANDA', 'HUALLPARA CACERES', '2018-12-28', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198124320239726', '15845885', 'ANA MICHELLE', 'HURTADO LIMACHI', '2019-04-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120231128', '15912087', 'JOSE ANDRES', 'JURURO FERNANDEZ', '2019-05-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198000820232559', '16384875', 'RONNY RAPHAEL', 'LIJERON DELGADILLO', '2019-06-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120233364', '15523252', 'ABIGAIL', 'LIMON BERRIOS', '2018-11-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402023936', '15385502', 'YSAIAS URIEL', 'MACHICADO ESPINDOLA', '2018-08-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120237902', '15433176', 'JHAEL FABRICIO', 'MAMANI OJEDA', '2018-09-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819816592023239A', '15340023', 'CRISTHIANY', 'MARQUINA GUARACHI', '2018-07-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120234509', '16659862', 'JUAN AGUSTIN', 'MERCADO MARAZ', '2019-06-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120233182', '15806219', 'DANIEL', 'MURILLO ESPINOZA', '2019-04-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120238900', '15483244', 'GEORGINA QUETZALY', 'OLMOS JATACO', '2018-07-07', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020239300', '15881085', 'JULIETA SAMARA', 'PAZ CONDE', '2019-05-12', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198149720234750', '15666299', 'FRANCO', 'RIBERA MONTERO', '2018-12-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912023610', '15867236', 'ISAIAS', 'RIVERA LAPACA', '2019-05-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020239619', '15582008', 'DIEGO', 'ROCHA ANTELO', '2019-01-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120232372', '17289479', 'EFRAIN', 'RUIZ QUISPE', '2018-09-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814492023354', '15731410', 'ZOE VALENTINA', 'SALVATIERRA ARANCIBIA', '2019-03-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814492023524A', '15332093', 'LUCAS STEFAN', 'SUAREZ PAZ', '2018-07-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120239078', '15736460', 'MOISES AARON', 'TORRES JALDIN', '2019-03-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120231339', '15910701', 'MIA NICOLE', 'UNZUETA VARGAS', '2019-05-23', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020231671', '15517667', 'MATIAS EVANDRO', 'URGEL SANDOVAL', '2018-11-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120232788', '16682218', 'BRIANA VALENTINA', 'URIMO CARDON', '2019-06-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Segundo B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 4 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981243202371', '15382016', 'LUCIANA ARLETH', 'ALARCON AÑEZ', '2018-08-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120234881', '15590790', 'ISABEL', 'ALMANZA IBAÑEZ', '2019-01-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120235821', '15390373', 'ELIAS', 'ANTEZANA ROBLES', '2018-08-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912024850', '15472702', 'MIA RENATA', 'BERNAL JIMENEZ', '2018-10-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198111020238069', '16798162', 'LIAM ZAID', 'CANDIA RUIZ', '2019-03-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198149720234436', '17585640', 'MIA ISABELLA', 'CARRILLO SOLANO', '2018-09-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120232103', '15780519', 'AGUSTIN GABRIEL', 'CASTRO QUISPE', '2019-03-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026820232933', '15325879', 'ADRIAN', 'CASUPA MURILLO', '2018-07-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198102320238695', '15838063', 'JHON CALEB', 'CHUMACERO PEREZ', '2019-04-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198123220236371', '15965407', 'ALEJANDRO', 'COLQUE SACA', '2019-06-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120231105', '15725245', 'ARIANE IBETH', 'CONDE SAAVEDRA', '2019-03-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120238119', '15732486', 'PAULETTE', 'EGUEZ CARBALLO', '2019-03-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120234385', '17329383', 'LIA FLORENCIA', 'ETCHEVERRY GALLARDO', '2019-06-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814972023150A', '15747110', 'ESTEFANY', 'GONZALES BACHO', '2019-03-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020233159', '15735426', 'IAN CALEB', 'HUANCA PACAY', '2019-03-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198133120232963', '15339383', 'LEANDRO', 'LEDEZMA FERNANDEZ', '2018-07-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812532024638A', '15413758', 'ERNESTO', 'LOPEZ SANCHEZ', '2018-09-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819816742023997', '15802001', 'JANELY', 'MELCHOR PALACHAY', '2019-04-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120235935', '15333603', 'BRIANA MICHELL', 'OLIVA MAMANI', '2018-07-12', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220239539', '15916321', 'IRENE SARAI', 'ORTIZ VARGAS', '2019-05-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120236398', '15763046', 'ALESSANDRA', 'PARRA ORTIZ', '2019-03-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119220235255', '15963028', 'ALTAIR', 'PEÑA ZARRAGA', '2019-06-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020239716', '15495614', 'LUCAS GREGORY', 'PIMENTEL FELIX', '2018-11-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120238359', '15937264', 'LETICIA', 'ROJAS PEDRAZA', '2019-06-04', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026820232443', '16555442', 'PABLO ASHER', 'ROMERO MARTINEZ', '2019-04-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120238884', '15422271', 'OLVER JAVIER', 'RUIZ PALACIOS', '2018-09-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120235143', '15357039', 'MATEO', 'SUAREZ MELGAR', '2018-07-31', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198136020242746', '15409588', 'SANTIAGO EZEQUIEL', 'TABORGA CUAQUIRA', '2018-09-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198137720232162', '15534083', 'MIREYA CLARA', 'TATTUM FERNANDEZ', '2018-12-06', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198012320236059', '15677492', 'IAN EZEQUIEL', 'TISCO ROJAS', '2018-07-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120249322', '15437119', 'ADRIANA', 'VEIZAGA FERNANDEZ', '2018-10-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819813602023946', '15461127', 'SHARON', 'VILAJA GUTIERREZ', '2018-10-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Tercero A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 5 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198038920222669', '16873023', 'SHECCID ALEJANDRA', 'CARBAJAL IKEDA', '2017-08-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198086820229250', '16916998', 'HAYLEN', 'CHUMACERO SANDI', '2017-09-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120233147', '15186673', 'SOFIA', 'DEL CASTILLO CUELLAR', '2018-02-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198165920224550', '16983105', 'LAURA INES', 'FLORES MARQUINA', '2017-11-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912021648A', '16288235', 'JUAN JOSE', 'GONZALES ORTIZ', '2017-05-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120237983', '16342140', 'MISAEL', 'GONZALES RODA', '2018-02-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198121920223221', '17047437', 'NICOLAS', 'LABARDENS JIMENEZ', '2018-02-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120228000', '17467747', 'ARTURO', 'LEIGUE ARREDONDO', '2018-02-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198025520227269', '16311774', 'FERNANDA MICHELLE', 'MAMANI SOLIZ', '2017-08-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020225121', '15514730', 'JOSE SEBASTIAN', 'MARISCAL GALARZA', '2017-07-31', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198164220236390', '15743026', 'ANDER', 'MARTICORENA MAITA', '2018-05-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120233922', '16264298', 'VICTORIA', 'MENACHO CESPEDES', '2017-10-07', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120227755', '17336074', 'JOSUE DILAN', 'OROCONDO ACAPA', '2018-01-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120227635', '15978538', 'LUCAS ELIAS', 'ORTEGA CORDERO', '2018-01-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020224694', '14837123', 'DANNA', 'ORTIZ LORA', '2018-03-06', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120221580', '16091019', 'VALENTINA', 'PACELLO IBAÑEZ', '2018-01-23', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912022147', '16114703', 'URIEL GUSTAVO', 'PAREDES JALDIN', '2018-01-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120221791', '16554964', 'JOSE FERNANDO', 'REYNOLDS SARAVIA', '2017-07-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120227914', '14973490', 'ALESSANDRA', 'RIBERA AGUILERA', '2017-08-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120227151', '17604393', 'BENJAMIN', 'RIVERA RODRIGUEZ', '2018-01-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120228513', '16744300', 'FABRICIO ADRIANO', 'RIVERO TORREZ', '2018-03-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198134820236118', '16271818', 'EZEQUIEL', 'ROCHA CHOQUE', '2018-01-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026020224735', '15279148', 'ELIAS YAHIR', 'ROJAS RIOS', '2017-10-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120224219', '16198225', 'ALISON', 'RUIZ MONTAÑO', '2017-09-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026820228545', '16969309', 'MATEO', 'SUAREZ SAUCEDO', '2018-01-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120231322', '17224842', 'ANGELICA ROMINA', 'TABORGA GUTIERREZ', '2018-02-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144920222542', '15176101', 'EMILIANO ALEM', 'VALDIVIA SIVILA', '2018-02-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120225035', '16818790', 'MARISOL', 'VALETA ZABALA', '2018-04-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198025520219812', '17719872', 'LUCAS', 'VEGA CHAO', '2017-04-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120225810', '16590899', 'MAXIMILIANO', 'VELASCO SOTO', '2018-02-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198060320221415', '15261919', 'MADISON', 'VELIZ GOMEZ', '2018-05-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120227573', '15813891', 'LUIS ENRIQUE', 'ZAMBRANA PARADA', '2018-04-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Tercero B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 5 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198025520221681', '15368921', 'FABIAN', 'ALPIRE LOPEZ', '2018-02-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020227186', '17058504', 'BENJAMIN', 'ALVAREZ PADILLA', '2017-07-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120225833', '17004288', 'ANTONELLA', 'AÑEZ SALVATIERRA', '2017-08-07', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912022304', '16617172', 'MATEO KALEB', 'BIAGAZO VELASCO', '2018-02-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020228639', '16833192', 'GAEL ALEJANDRO', 'BORDA URGEL', '2018-05-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120229859', '14942628', 'FRANKO', 'BUTRON SAUCEDO', '2017-07-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020228366', '16157604', 'SEBASTIAN', 'CAMACHO PERALES', '2018-02-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120227060', '15239006', 'LIAM EMANUEL', 'CANAVIRI VEGA', '2018-01-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912022792', '15717786', 'BELEN OLIVIA', 'CASTRO CONDORI', '2017-07-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120228867', '15720528', 'YELINNE', 'CHAVEZ MAMANI', '2018-04-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981191202235', '15515856', 'EDDY EDUARDO', 'COCA HURTADO', '2018-02-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120232058', '15938212', 'VICTORIA FIORELLA', 'CORTEZ SAUCEDO', '2018-04-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980869202247', '15231464', 'SARA VALENTINA', 'CUBA MONTAÑO', '2017-09-20', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120228906', '15383366', 'IAN ABDIEL', 'ESCALANTE ARAUZ', '2018-03-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120221785', '15208129', 'DARA GALILEA', 'GUTIERREZ BARRIGA', '2018-03-15', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120226455', '16310498', 'RAFAELA', 'GUTIERREZ JOFFRE', '2018-04-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120233273', '17150796', 'ISASHI BENJAMIN', 'HURTADO PALOMEQUE', '2018-01-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '3192004720224557', '15209689', 'BENJAMIN JACOB', 'IBAÑEZ PADILLA', '2017-08-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120227538', '15523665', 'SARAH THAIS', 'JULIEN ARAUZ', '2017-12-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120227310', '16411626', 'LUCAS ADRIAN', 'JUSTINIANO PADILLA', '2017-06-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912022890', '17004111', 'BRIANA NICOL', 'JUSTINIANO VACA', '2018-02-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198097820226769', '15474200', 'MIA RAPHAELLA', 'LIMON CORDERO', '2018-02-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912022753', '15402834', 'ANTONHELY', 'MELGAR PARADA', '2017-08-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198085620223517', '17196281', 'ALEJANDRO RADAMEL', 'MENACHO VELASCO', '2017-12-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120225064', '16982370', 'IRINA LEONELA', 'MIRANDA CORTEZ', '2017-09-19', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198166620225662', '15281191', 'IAN MATEO', 'OCAMPO CUELLAR', '2018-05-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120228211', '15371031', 'ISOLDE', 'POQUECHOQUE AGREDA', '2018-04-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198151920225828', '16868411', 'ISABELLA', 'RIBERA PADILLA', '2017-07-29', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119220236646', '15313668', 'AGUSTIN', 'STIPANCICH BRUZZO CASTRO', '2018-06-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8048016820224770', '15851366', 'ISHA HINENI', 'TEJERINA FARFAN', '2018-05-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8193003720224326', '16515131', 'DANNA OLIMPIA', 'TOLEDO VARGAS', '2017-12-04', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Cuarto A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 6 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120214152', '16240061', 'ANALY', 'AGUILAR FLORES', '2017-02-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020043', '14808173', 'AMIRA VALENTINA', 'AÑEZ SARAVIA', '2016-09-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120213667', '14973353', 'JOEL', 'ANGLARILL JUSTINIANO', '2017-02-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720227716', '17067318', 'THIAGO BEZALEEL', 'ANTEZANA ROBLES', '2016-11-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198156020214100', '15551444', 'JADIEL', 'ARAMAYO HUALLPA', '2017-01-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020219256', '16883930', 'LIAM KENDRICK', 'ARENAS CANAVIRI', '2016-09-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120212367', '17000064', 'SAMUEL', 'AZOGUE BUCETA', '2016-11-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198012320213237', '14972507', 'ROSSIO MIA', 'BEJARANO HUAYLLA', '2017-05-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120217407', '16664468', 'DARA JUDITH', 'CHOQUE CAMPOS', '2017-01-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020047', '17660062', 'EZEQUIEL', 'DIAZ BARBA', '2016-07-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120214386', '16005478', 'JESUS EMMANUEL', 'EGUEZ VEIZAGA', '2017-01-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198146620211852', '17000381', 'MIA VALERIA', 'ENDARA CARDONA', '2017-01-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020212213', '15962466', 'VALERIA ARLET', 'ESCALERA TAMAYO', '2016-11-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020048', '14869445', 'MARIA ANTONELLA', 'GARCIA CRUZ', '2017-03-08', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372022335A', '14871625', 'DANIEL IGNACIO', 'HURTADO PALOMEQUE', '2016-07-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120211528', '17582300', 'FLAVIO', 'JUSTINIANO GALINDO', '2017-01-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198000820217236', '15528998', 'RONNY GAEL', 'LIJERON DELGADILLO', '2016-12-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912022385A', '15961791', 'ROXANA NAZARETH', 'MEDINA ALMANZA', '2016-08-29', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020054', '15063964', 'JUAN SANTIAGO', 'MENA SANCHEZ', '2016-07-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020055', '15030661', 'SALOMON', 'MOLINA FERNANDEZ', '2017-06-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120216911', '14990849', 'RUTH NAOMI', 'MONTAÑO CALVI', '2017-05-25', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120216541', '13253266', 'ANDERSON RUBEN', 'MORALES MAMANI', '2016-07-31', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023920216133', '16269880', 'MARIANA', 'QUISBERT CORTEZ', '2016-10-12', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020059', '16180854', 'NICOLAS ELIAM', 'RODRIGUEZ GIL', '2017-06-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020060', '15189936', 'CESIA', 'ROMERO CALLAO', '2016-11-30', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220217744', '16644148', 'LEO EMANUEL', 'RUIZ RUIZ', '2016-09-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120216649', '15517621', 'MATHIAS', 'SALVATIERRA BARBA', '2017-04-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372022291A', '16974257', 'LIAM GAEL', 'SANDOVAL AGUILAR', '2016-11-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120229129', '15555091', 'SEBASTIAN', 'SOLARES BECERRA', '2017-06-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912021518A', '16307885', 'MOISES', 'SUAREZ ROSPILLOSO', '2017-02-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020213325', '14971413', 'FIORELLA', 'TORREZ LARREA', '2017-05-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120216165', '14993702', 'ARLET', 'VACA GUANDURUY', '2017-01-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120217397', '14970633', 'MILA ALEJANDRA', 'VARGAS PAREDES', '2017-05-02', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Cuarto B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 6 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198158420214307', '15037848', 'MIKAELA', 'ALVAREZ CARDOZO', '2017-03-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198112120211464', '14970745', 'JOSUE', 'ANTEZANA BALDIVIEZO', '2016-09-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198123220218550', '16392006', 'DIOGO', 'AVILA AYALA', '2017-06-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198097720226589', '17064270', 'MARTINA', 'BERNAL JIMENEZ', '2017-04-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120229158', '15423702', 'JUAN DIEGO', 'CACERES VALDA', '2017-05-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120219335', '15863189', 'LYAM SAID', 'CESPEDES MONTAÑO', '2016-09-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402021798A', '16512324', 'LIAM EMANUEL', 'CHAVEZ ROUG', '2016-12-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198053920217686', '15635779', 'BRITHANY FABIANA', 'CHOQUE DIAZ', '2016-06-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198121520211439', '14992220', 'JHERAN JOSUE', 'CHUMACERO PEREZ', '2017-06-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198060320214798', '15062027', 'ARLETT GUADALUPE', 'ESCALIER COSSIO', '2017-03-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220214779', '16925116', 'ABNER RAFAEL', 'HERRERA PARARI', '2017-05-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020218099', '14873419', 'VLADIMIR', 'JACINTO LEYGUE', '2016-09-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020050', '15523648', 'ALEXIA VALENTINA', 'JULIEN ARAUZ', '2016-07-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912022783A', 'S/CI-819811912022783A', 'MAGDIEL', 'LEAÑOS FLORES', '2016-12-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020216706', '14877917', 'RUDY', 'LEIGUE IBAÑEZ', '2016-08-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020008', '15578839', 'CAMILA', 'MERCADO ROBLES', '2016-04-12', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020215805', '16863856', 'LUKA', 'MUÑIZ RIVERO', '2016-12-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812122022711', '17242731', 'ANNEL TIRZA', 'MURGA CARVAJAL', '2017-05-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120221175', '17031044', 'SERGIO', 'PARICAHUA PEREZ', '2017-04-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198143020219491', '16301703', 'FABRICIO', 'PINO CUELLAR', '2016-09-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198053920212507', '16751019', 'EMMA VALENTINA', 'QUINTELA RIVAS', '2017-05-15', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8073046620212060', '16581034', 'MICAELA ARELI', 'REYEROS GOSALVEZ', '2017-03-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198148820215360', '14871402', 'SANTIAGO', 'RODRIGUEZ LOPEZ', '2016-07-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120226916', '17013144', 'MAIA', 'SOLIZ AYALA', '2016-12-07', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198048720217823', '16992164', 'SAMIRA', 'SUAREZ MONTENEGRO', '2016-09-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020215224', '14934941', 'SAMANTHA', 'SUAREZ VASQUEZ', '2016-10-25', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120221454', '16818814', 'CRISTOBAL', 'VALETA ZABALA', '2016-09-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198111820213337', '15236757', 'NICOLAS MATHIAS', 'VERDUGUEZ GONZALES', '2017-06-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020062', '17005088', 'MATHIAS', 'VIDAL PRADEL', '2016-07-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144020211426', '15325059', 'NAYELI FERNANDA', 'VIRUEZ LOBO', '2017-02-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198125820219528', '15611380', 'ABDIEL', 'YUCRA SUAREZ', '2017-06-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8197004120211857', '16414578', 'SALVADOR', 'ZABALA ZABALA', '2017-02-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Quinto A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 7 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019026', '15932788', 'ROSEMBERTH', 'AGUILERA LEAÑOS', '2015-09-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819816572019013', '16304420', 'IAN CARLO', 'ANTELO CHAVEZ', '2016-03-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020001', '17067305', 'ARELI SHARLET', 'ANTEZANA ROBLES', '2015-08-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020003', '15572930', 'ELIAS', 'ARANCIBIA VASQUEZ', '2016-01-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019014', '15720567', 'MILETT', 'ARANIBAR VERDUGUEZ', '2015-10-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020016', '15587465', 'JOSIAS ALBERT', 'ARAUZ PALAVECINO', '2016-04-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802602020039', '14942629', 'YERKO', 'BUTRON SAUCEDO', '2016-02-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811102020032', '16263119', 'SHARON ARELY', 'CHOQUE JALDIN', '2016-03-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812322020050', '17380449', 'AARON', 'COLQUE SACA', '2016-06-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019092', '14749265', 'XIOMARA ABIGAIL', 'CORDOVA QUIROGA', '2016-01-20', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020005', '15520851', 'JOSIAS', 'CUELLAR AÑEZ', '2016-06-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802552020042', '15241873', 'BRISIA ISABELLA', 'GONZALES CLAROS', '2016-05-09', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811102020010', '17263963', 'SEBASTIAN', 'GONZALES RICALDIS', '2015-08-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019017', '14632570', 'EMILY SHARON', 'GUTIERREZ MEDINA', '2015-12-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809822020871A', '15548217', 'DEILY ANABEL', 'JURURO FERNANDEZ', '2016-06-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020006', '16995599', 'RENATO', 'JUSTINIANO JUSTINIANO', '2016-01-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020069', '14659009', 'YAMILE BELEN', 'LLANQUE TAPIA', '2016-03-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811102020041', '14930231', 'SANTIAGO', 'MALDONADO ESPINOZA', '2015-09-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019027', '14724504', 'AINARA', 'MENDEZ MELGAR', '2015-12-23', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720216519', '16291338', 'SHALEM', 'PAZ AGUILERA', '2016-03-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020070', '14968032', 'MISAEL', 'PEÑA CARIUNDI', '2016-03-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198123920202029', '15121181', 'ELIAS EIDHEN', 'PEREZ CAVERO', '2015-10-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402020014', '14874097', 'EDWARD JACOB', 'PIMENTEL FELIX', '2015-12-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020009', '16180841', 'RUTH BRISA', 'RODRIGUEZ GIL', '2016-04-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020071', '15277641', 'ANNEL SAMARA', 'RODRIGUEZ HEREDIA', '2015-07-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819801282020065', '16142237', 'ANDERSON', 'RODRIGUEZ TAPIA', '2015-11-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019054', '15466534', 'NICOLAS', 'ROJAS PADILLA', '2016-02-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019028', '14868957', 'JOSE MIGUEL', 'ROJAS PEDRAZA', '2016-03-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020072', '17046901', 'LEANDRO', 'SALAS CAERO', '2016-01-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020011', '16327529', 'SEBASTIAN ANDRES', 'SAUCEDO CHURA', '2015-09-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020012', '14385898', 'BRUNO', 'SOLETO GUARDIA', '2015-09-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020014', '15782284', 'SAUL ALEJANDRO', 'TORRICO DOMINGUEZ', '2016-05-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802602020037', '14457991', 'MATIAS', 'URGEL MELGAR', '2016-04-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Quinto B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 7 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120217089', '16630684', 'LUCAS DANIEL', 'AGUILAR TORREZ', '2015-10-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198115920202603', '17026240', 'NICOLAS', 'AÑEZ BENDEL', '2016-03-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198109320207916', '16549551', 'AARON', 'ARDAYA AYALA', '2016-03-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8048005120212493', '17116670', 'EIMI RUBI', 'CALDERON CORONADO', '2015-08-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402020006', '16157592', 'EILEEN', 'CAMACHO PERALES', '2016-01-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372020006', '14665608', 'ELSA FABIANA', 'CESPEDES MENDEZ', '2015-11-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020018', '15674277', 'BRISEYDA', 'CHAVEZ MAMANI', '2016-06-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198165920208252', '16307635', 'SOFIA ANGELA', 'CHAVEZ VICENTE', '2015-07-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020019', '17003642', 'MAYLEN SARAI', 'CONDORI LOPEZ', '2016-06-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020020', '15877163', 'MAXIMILIANO', 'DURI NAURO', '2016-01-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811182020009', '15640631', 'ERIBERTH BRUNO', 'FALDIN VACA', '2016-02-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120215138', '14478302', 'SAMUEL', 'GUTIERREZ GIRONDA', '2016-04-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144920217013', '15235643', 'SANTIAGO', 'GUTIERREZ VARGAS', '2016-05-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198165920201096', '15524895', 'IVER ADRIAN', 'GUTIERREZ ZEBALLOS', '2016-04-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020022', '15324622', 'BRIANNA FABIOLA', 'HEVIAVACA VASQUEZ', '2016-03-21', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720218453', '15471115', 'ALLISON', 'LIMON BARRON', '2015-07-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802552020122', '16311810', 'ADRIANA GUISEL', 'MAMANI SOLIZ', '2015-11-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020007', '16264302', 'CARMELO', 'MENACHO CESPEDES', '2016-05-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402020011', '15411066', 'NAHIARA AYDEM', 'MORUNO PERALES', '2015-07-31', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812432020016', '16211063', 'ABIGAIL FERNANDA', 'PANIAGUA VIZA', '2016-03-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120216421', '17022586', 'LUCAS', 'PARDO SIERRA', '2016-03-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812252020013', '14936170', 'VALENTINA', 'RIVERA LAPACA', '2016-04-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812602019022', '15553408', 'SASHA', 'RIVERA RODRIGUEZ', '2016-06-02', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019055', '15953948', 'ANGEL YASHELL', 'ROSALES BARRIOS', '2015-09-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198111120207185', '14386114', 'MATIAS ALEXANDER', 'SOLARES BECERRA', '2015-09-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372020018', '15175616', 'SANTIAGO', 'SUAREZ ROSPILLOSO', '2016-01-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8173018420203235', '13169089', 'LUIS MATEO', 'TEJERINA FARFAN', '2016-01-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811322020117', '16682251', 'IBEN ALBEIRO', 'URIMO CARDON', '2016-04-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020031', '15593349', 'FACUNDO', 'VACA GONZALES', '2016-04-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020032', '14750026', 'TALITHA BRYANNA', 'VALVERDE AGUILAR', '2015-12-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198106420212881', '14779295', 'IVAN JOSUE', 'VARGAS CHUMACERO', '2016-02-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020033', '14470509', 'ANTONELLA JADE CECILIA', 'VEGA VARGAS', '2015-12-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819804872020056', '14576947', 'BRIANNA', 'VELEZ MONTENEGRO', '2015-10-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Sexto A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 8 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815402019002', '14574685', 'SANTIAGO', 'ALVAREZ CARDOZO', '2015-04-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802612019055', '14929741', 'GERSON RAFAEL', 'AMAYA MELGAR', '2015-02-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018044', '14137726', 'JOSE DIER', 'ANDRADE RAMOS', '2015-02-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402019002', '14135684', 'ADRIANA', 'ARANCIBIA MARISCAL', '2014-08-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019053', '15494039', 'ANA AYELEN', 'CABALLERO VARGAS', '2015-05-31', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819808692019009', '14689359', 'PAUL MATIAS', 'CUBA MONTAÑO', '2014-08-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018060', 'S/CI-819811912018060', 'DAVINIA', 'DEL RIO PALACIOS', '2014-11-20', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018050', '15307583', 'JAMES JUNIOR', 'DURAN PATICU', '2015-03-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198165920209056', '14407355', 'NAZARETH', 'FLORES MARQUINA', '2015-04-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019066', '14990887', 'VALENTINA', 'GIL CAMPOS', '2015-03-09', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802512019053', '15241941', 'JUAN DANIEL', 'GONZALES CLAROS', '2014-10-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811102019045', '14435882', 'MARIA ALEJANDRA', 'JALDIN SOLARES', '2015-05-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402019037', '14775607', 'AGUSTIN GERALD', 'LORENT LOPEZ', '2015-06-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802392019013', '14659405', 'AVRIL LIA', 'LUNA APAZA', '2015-06-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018063', '15961763', 'MATEO', 'MEDINA ALMANZA', '2015-05-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198059720205099', '15836836', 'CAMILA', 'MELCHOR PALACHAY', '2015-06-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372019001', '15931054', 'GUSTAVO ADRIAN', 'MONTAÑO BAYA', '2014-11-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809822019055', '15045167', 'YAISA PATRICIA', 'ONDARZA ROCABADO', '2015-03-18', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198060420208320', '16655838', 'VALENTINA', 'ORELLANA YUCO', '2015-06-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018053', '14474320', 'NOEMI ARACELI', 'ORTEGA CORDERO', '2015-01-29', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019067', '15733327', 'VALENTINA', 'ORTIZ ROMERO', '2014-10-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018048', '15258688', 'BENJAMIN JOEL', 'PANIAGUA POMA', '2015-01-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019056', '14989650', 'LEONELA', 'PANIAGUA ROJO', '2015-03-31', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402019014', '15741261', 'EMMANUEL', 'PARADA TORREZ', '2015-02-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018035', '15253263', 'ABBY DUANETH', 'RODRIGUEZ ROCABADO', '2014-07-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019062', '15491105', 'IVANA VICTORIA', 'SAUCEDO CHURA', '2014-07-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802322019027', '14723849', 'LUCIANA', 'SOLETO OCAMPO', '2014-08-28', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018034', '14253799', 'ANDRES', 'SUAREZ MELGAR', '2014-12-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811362019042', '14161272', 'KANDRA DOMINIQUE', 'TORREZ PEÑA', '2014-07-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019076', '14635095', 'ISA VANESA', 'VASQUEZ NEGRETE', '2015-04-09', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019080', '15953049', 'KEVIN', 'ZAPATA FORERO', '2014-07-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Primaria Comunitaria Vocacional - Sexto B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 8 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815842020034', '14453882', 'AILIN MIKAELA', 'ALGARAÑAZ MONTERO', '2014-10-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020035', '13456540', 'JOSE ENRIQUE', 'BELTRE RUA', '2014-07-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019072', '15943694', 'MARIEL', 'CASTRO QUISPE', '2014-08-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802392019038', '15863256', 'JORGE DYLAN', 'CESPEDES MONTAÑO', '2015-06-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019058', '14942736', 'DANELI', 'CLAROS ARAS', '2015-06-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809782019054', '16202666', 'JULIO IGNACIO', 'CUELLAR ALARCON', '2014-08-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019041', '14469437', 'LUCAS', 'DOMINGUEZ MOGROVEJO', '2014-12-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120184986', '15962737', 'LUCAS MAGDIEL', 'FARELL CAMACHO', '2014-08-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019085', '15942507', 'ADRIAN NATANAEL', 'FARFAN JUSTINIANO', '2015-04-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019084', '14409483', 'MARIO ANDRES', 'GARCIA CRUZ', '2015-04-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144920203171', '15235589', 'ISLAY', 'GUTIERREZ VARGAS', '2014-07-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815762019034', '15576009', 'TIFFANY', 'MARQUEZ MONTERO', '2014-09-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809342019033', '14467440', 'LENA CONSTANZA', 'MENA SANCHEZ', '2014-09-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019047', '16811746', 'JAIRO THARIEL', 'MENDOZA ROMERO', '2014-10-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198156920204116', '15608284', 'BRIYITH DANIELA', 'MONTENEGRO VASQUEZ', '2015-05-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402019012', '16863879', 'EMMA', 'MUÑIZ RIVERO', '2015-03-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018036', '14786819', 'SANTIAGO', 'MUÑOZ CUELLAR', '2014-11-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019045', '14903691', 'LUCAS ROBIN', 'OROCONDO ACAPA', '2015-04-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '619200012019024', '15397891', 'MILAN', 'PADILLA EGGERS', '2015-06-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018039', '14971461', 'AARON', 'PANAMA UGARTE', '2014-09-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812252019019', '14254972', 'SEBASTIAN', 'PARDO FLORES', '2015-03-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018041', '15941603', 'JESSIA FRIDA', 'PAREDES CAMACHO', '2015-05-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811292019014', '14271036', 'FERNANDO GAEL', 'PEÑA SERRANO', '2015-05-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912020039', '17052215', 'ADRIANA SARELY', 'RIVERO VALVERDE', '2014-09-04', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '807304662019201', '14703699', 'VICTORIA ISABELA', 'ROJAS MACHICADO', '2014-09-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372019020', '15966055', 'VIOLETTA ALESSIA', 'SEJAS ALVAREZ', '2014-09-09', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018038', '14656784', 'MAXIMILIANO', 'TORREZ ALESSANDRI', '2015-02-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811322020011', '16682260', 'SHERLIN DOMINIK', 'URIMO CARDON', '2015-03-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812192019034', '14972914', 'FLAVIA', 'VACA OVANDO', '2014-12-30', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811182019003', '14662058', 'LUCAS FABRICIO', 'VACA SEMO', '2015-06-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802612019117', '16597922', 'EIMY NICOL', 'YEYANDAR TRIGO', '2014-08-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812432019008', '14874315', 'AMIEL ARIADNA', 'YUCRA SUAREZ', '2015-06-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Primero A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 9 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018027', '14773117', 'RENATA VALERIA', 'ANGELO MORO', '2014-05-15', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018016', '15588203', 'ISRAEL', 'ARAUZ PALAVECINO', '2014-04-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811342017004', '14086786', 'ANDRES JARED', 'BARRANCOS RODRIGUEZ', '2014-05-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198123220181144', '16242405', 'ISABELLA', 'BARRIGA WENDE', '2014-02-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018024', '14749926', 'ESTEBAN MATEO', 'BARROSO ZARATE', '2013-12-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812322019004', '14132782', 'WALTER GHIULLIANO', 'BURGOS SALAS', '2014-04-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119220183798', '17040375', 'JOSHUA NEHEMIAH', 'CAMACHO ADAUTO', '2014-07-29', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018019', '15717672', 'DANNA SOFIA', 'CASTRO CONDORI', '2013-11-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018033', '15213874', 'DAYRA LISBETH', 'CASTRO HURTADO', '2013-10-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402018013', '14133736', 'SAMIR', 'CHAVEZ ROUG', '2014-02-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819813372019001', '14472405', 'LYNDA MISHEL', 'COLQUE RODRIGUEZ', '2014-01-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018021', '14471772', 'MATEO', 'FLORES BASTOS', '2013-12-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017006', '14253962', 'SCARLET MISHEL', 'GONZALES GALARZA', '2013-09-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018003', '14632569', 'PAULA RENATA', 'GUTIERREZ MEDINA', '2014-07-23', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372018018', '15105156', 'XIOMARA YIRETH', 'HURTADO VACA', '2014-07-15', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018029', '15208189', 'MELANIE SARAI', 'JUSTINIANO VIDES', '2013-07-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018026', '14053066', 'ELIZABETH FERNANDA', 'MAREÑO CLAROS', '2014-06-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017064', '13979191', 'ELIANA SHIREL', 'MEDINA GONZALEZ', '2014-01-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802612018138', '16043488', 'JOSE MARIA', 'MERCADO ANTELO', '2014-01-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815592018110', '15047042', 'THIAGO ANDRE', 'ORTIZ CEREZO', '2013-10-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017049', '13977803', 'JOSHUA CALEB', 'PANIAGUA GOMEZ', '2014-06-06', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811292018013', '14633428', 'OSCAR ADRIAN', 'QUISPE AGUILAR', '2014-04-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '807304662018150', '15499104', 'ADRIANA NAOMI', 'REYEROS GOSALVEZ', '2014-05-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810652018011', '16396929', 'EDUARDO ISMAEL', 'RIBERA PADILLA', '2014-02-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018028', '15275419', 'LEONARDO', 'RODAS VARGAS', '2014-01-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017065', '13145294', 'MAURICIO DANIEL', 'RODRIGUEZ DORFELT', '2013-09-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '407300182018084', '14703698', 'SAMAEL RAFAEL', 'ROJAS MACHICADO', '2013-09-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810502019058', '16193637', 'LEONEL', 'ROMERO GUTIERREZ', '2014-06-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017063', '13488725', 'VALENTINA', 'ROMERO VILLEGAS', '2013-07-06', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018032', '14995508', 'BENJAMIN', 'SORIA RAMALLO', '2014-05-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018015', '13546197', 'LOGAN TSUYOSHI', 'TAMASHIRO ZABALA', '2014-01-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814972018104', '14395263', 'OSCAR LUIS', 'TORREZ LARREA', '2014-05-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815422018017', '14408929', 'DOMINIC', 'TORRICO SUAREZ', '2013-12-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Primero B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 9 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815492018010', '14633215', 'LUCAS', 'AUDIVERT TERRAZAS', '2013-10-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815282018005', '16157582', 'KATHALEYA', 'CAMACHO PERALES', '2014-02-04', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402018010', '15123542', 'RAFAEL', 'CAMPOS CABRERA', '2013-10-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811732018008', '15238958', 'NICOLAS SAMIR', 'CANAVIRI VEGA', '2013-08-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812252018008', '15136718', 'YANICE', 'CASUPA MURILLO', '2013-08-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809782018118', '15857512', 'NICOLE MICHELLE', 'CUELLAR CASPARY', '2014-05-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819804072018001', '15095148', 'CAMILA', 'DAMM GOMEZ', '2014-02-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811182018007', '14254122', 'ALEXIA', 'DEL CASTILLO CUELLAR', '2014-04-15', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819805832018057', '15877150', 'HOLT', 'DURI NAURO', '2014-06-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812322019005', '14053115', 'MICAELA', 'HUALLPARA CACERES', '2014-05-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802602018060', '14661910', 'FABIANA', 'JUSTINIANO GALINDO', '2013-09-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802602018062', '14102648', 'BRIANA ITZEL', 'MAGNE CORIA', '2014-06-02', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809342018066', '12723177', 'SOFIA VALENTINA', 'MENA SANCHEZ', '2013-09-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402018038', '14809534', 'JEAN CARLOS', 'MENDOZA RUA', '2014-01-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811732018062', '13974428', 'NATANIEL ALEXIS', 'MORALES BERNAL', '2014-05-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018067', '15933397', 'MARIA FERNANDA', 'OLIVA MAMANI', '2013-08-15', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809822018046', '15045151', 'CARLOS MATEO', 'ONDARZA ROCABADO', '2014-01-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819805392017087', '13962962', 'CAMILA', 'PAÑUNI CHAMBI', '2013-04-19', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809772018101', '14990910', 'ARIANE GUADALUPE', 'PARRA ORTIZ', '2013-09-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814492019072', '14808722', 'VANIA', 'PITTARI CESPEDES', '2014-05-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402018049', '13673794', 'ANDRES', 'PRADO BUSTILLOS', '2013-08-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814362018021', '15027574', 'BRITANY LUCIANA', 'ROJAS GARCIA', '2014-05-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814182018042', '14868969', 'MARIA FE', 'ROJAS PEDRAZA', '2013-10-15', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809822018002', '14810195', 'LEONARDO GABRIEL', 'RUIZ OVANDO', '2014-01-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402018050', '14657106', 'MARCO ANTONIO', 'SOLIS TOLA', '2014-06-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815842018012', '15489961', 'TALITA', 'SOLIZ LIMPIAS', '2014-03-31', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809782018004', '15879681', 'LUCIANA', 'STIPANCICH BRUZZO CASTRO', '2014-05-09', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018014', '14872531', 'DENNIS JOSUE', 'TABOADA CESPEDES', '2014-06-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812612018041', '14811468', 'RAFAELA', 'VACA MOLINA', '2014-03-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811562018018', '14132740', 'ANDRES', 'VACA OVANDO', '2014-01-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814492019069', '16244339', 'JOSIAS CALEB', 'VILLARROEL MONTAÑO', '2014-04-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814492019070', '16244337', 'JOSUE GAEL', 'VILLARROEL MONTAÑO', '2014-04-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018025', '16805154', 'SILVIA DENISSE', 'YAVITA GOMEZ', '2013-08-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Segundo A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 10 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810832017073', '14874765', 'MARIANA', 'AGUILERA ZAMORA', '2013-04-08', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802322017050', '16174834', 'MILAGROS BELEN', 'ALGARAÑAZ CAMACHO', '2012-10-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017020', '14633264', 'EZEQUIEL ANDRES', 'ALI CHOQUE', '2013-04-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017031', '14137727', 'SAMUEL', 'ANDRADE RAMOS', '2013-06-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819801232017130', '13079833', 'LIAM JOSUE', 'BEJARANO HUAYLLA', '2013-02-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810232017083', '13431842', 'VALENTINA', 'CHAMBI MOJICA', '2012-09-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810522017003', '15414910', 'ALEXIA', 'CUELLAR ARENAS', '2013-04-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802322017111', '14137288', 'NOELIA', 'MARTINEZ IBARRA', '2013-04-06', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017018', '14565928', 'LUCAS ANDRE', 'MENA HINOJOSA', '2013-01-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815612017008', '16872664', 'SARITA', 'MENACHO CESPEDES', '2013-01-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017019', '13017710', 'SEBASTIAN', 'MENDEZ HINOJOSA', '2012-10-31', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809822017039', '13974011', 'KIARA ABIGAIL', 'MENDEZ JALDIN', '2012-12-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017018', '14061634', 'NAVIF STEVEN', 'MERCADO VACA', '2013-05-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017046', '15525469', 'MARVIN MATEO', 'MIRANDA BARRETO', '2013-06-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810832016040', '15735088', 'ELIAS', 'MONTERO MONTERO', '2011-10-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811732017016', '13015197', 'EMANUEL JESUS', 'MORALES BERNAL', '2013-01-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811562017046', '14903728', 'YAHIR ERWIN', 'OROCONDO ACAPA', '2012-08-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017022', '12987459', 'ALISSON', 'ORTEGA VELASQUEZ', '2012-12-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017057', '13639254', 'JONATAN', 'PACHECO DORFELT', '2013-03-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815312017001', '14254973', 'MARCO ANDRE', 'PARDO FLORES', '2013-03-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815142017032', '13429682', 'SAULO', 'REVOLLO PAZ', '2013-04-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017001', '13972674', 'JOSIAS DANIEL', 'RIBERA HURTADO', '2013-07-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912019090', '13174226', 'ISABELLA', 'RIFARACHI MANSILLA', '2012-10-04', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017042', '14748222', 'MATHIAS JOEL', 'RIVERO ALVARADO', '2012-07-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017045', '14772256', 'ZOE MARIANNE', 'RODRIGUEZ ROCABADO', '2012-08-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017028', '15953979', 'YARIS EMANUEL', 'ROSALES BARRIOS', '2013-06-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017012', '13174160', 'KEISY ARIANE', 'RUIZ PALACIOS', '2013-03-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017016', '14053543', 'LUCIANA', 'SALAZAR ROCHA', '2013-02-02', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812612017041', '14811469', 'ARIANA', 'VACA MOLINA', '2012-07-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819400282017090', '14607874', 'SHARON ADRIANA', 'VARGAS RAMOS', '2013-01-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812412017007', '12884970', 'SAMUEL', 'VELASCO CUEVAS', '2012-11-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811182017036', '12885079', 'JHON HAROLD', 'VELIZ LOPEZ', '2012-10-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Segundo B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 10 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819805382018080', '16630676', 'PAOLA DIANA', 'AGUILAR TORREZ', '2013-02-08', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402017004', '15037611', 'JOSE ARTURO', 'ARAUZ PAZ', '2012-12-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372018001', '15539684', 'MIQUEAS DANIEL', 'BAÑON GUZMAN', '2013-01-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815602017016', '13962773', 'MATIAS ALEN', 'BRAVO VEGA', '2012-12-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810472017003', '15494036', 'ADRIANA', 'CABALLERO VARGAS', '2012-10-23', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8048005120217095', '17116652', 'DYLAN', 'CALDERON CORONADO', '2012-12-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811922017063', '17024025', 'SANTIAGO', 'CARRASCO RODRIGUEZ', '2013-03-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017009', '14871647', 'ELIAS', 'CARRILLO SORIA', '2013-03-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018005', '14972424', 'LUCIANA GABRIELA', 'CASTRO DURAN', '2013-05-06', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812432017005', '14088036', 'MAILY', 'CESPEDES MONTAÑO', '2012-07-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '714100072017038', '16627594', 'MARIANA GUADALUPE', 'CHIRI AYALA', '2013-03-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402017009', '14131833', 'JOSE LEONARDO', 'CORONADO TERCEROS', '2012-07-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198065720182336', '15938227', 'BELLA ROSE', 'CORTEZ SAUCEDO', '2013-04-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017024', '13634405', 'VALERIE', 'DAZA SALVATIERRA', '2013-04-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819808682017081', '15942437', 'GABRIEL LEANDRO', 'FARFAN JUSTINIANO', '2012-11-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372018002', '14992485', 'NATALIA', 'GARCIA FLORES', '2013-03-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811322017085', '13304338', 'VALERIA', 'GONZALES ORTIZ', '2012-11-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815682017035', '13110607', 'VALENTINA BELEN', 'GRAGEDA RUIZ', '2012-12-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402017034', '13018982', 'JORGE SEBASTIAN', 'GUTIERREZ CASAS', '2013-03-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017012', '14794336', 'CESAR LEANDRO', 'HERRERA ESCALANTE', '2013-05-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809822017093', '14089075', 'ANDREA BELEN', 'JURURO FERNANDEZ', '2013-05-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372016016', '13014451', 'LEILA INES', 'LOPEZ COLQUE', '2011-11-25', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017015', '15122373', 'ARIEL GUSTAVO', 'MACHICADO ESPINDOLA', '2013-06-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812212017050', '14262920', 'KATHERINE BRIANNA', 'MEJIA MUJICA', '2013-05-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802322017067', '15251575', 'ANGEL SANTIAGO', 'MOLINA OLMOS', '2013-01-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810832017071', '13111379', 'JOSUE FERNANDO', 'ORTEGA CORDERO', '2012-10-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810832017018', '15491630', 'CRISTIANI', 'PANIAGUA RIBERA', '2012-08-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811492017025', '15098387', 'BRIANA LUCERO', 'RIVAS PARADA', '2013-02-12', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812432017014', '13433446', 'MATIAS', 'RUIZ MONTAÑO', '2012-12-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017033', '13396778', 'GUILLERMO', 'VALDEZ CONCHA', '2012-10-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017026', '14433955', 'DYLAN SAMIR', 'VELASCO ROBLES', '2013-01-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812282017006', '13435316', 'NATALIA', 'VILLALOBOS CARDOZO', '2013-03-04', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017034', '14293425', 'JOEN ISRAEL', 'VILLEGAS ANTONIO', '2013-05-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372017036', '15978198', 'JESUS ANDRES', 'ZAPATA VARGAS', '2013-02-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Tercero A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 11 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402017001', '15037609', 'ALEJANDRA', 'ARAUZ PAZ', '2011-10-04', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802322016039', '14749925', 'PABLO DIEGO', 'BARROSO ZARATE', '2012-04-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819804872016042', '14467829', 'MATEO', 'BERNAL JIMENEZ', '2012-05-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016019', '15008973', 'JORGE', 'BERRIOS ROCHA', '2011-09-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810932016002', '16549548', 'DAYAN MATEO', 'BONILLA AYALA', '2011-07-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402016031', '13719910', 'KARLA MARIA', 'CAMPERO ESTRADA', '2011-08-12', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819808692016025', '15590735', 'ANEL XIANY', 'CANDIA CANDIA', '2012-02-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811092016011', '14973909', 'JHOSUA BENJHAMIN', 'CAYOJA PAZ', '2012-06-30', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819800692016035', '16266393', 'CANDY YARELY', 'CHARACAYO GABRIEL', '2012-09-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812612016007', '13779742', 'ALEX', 'CHUMACERO PEREZ', '2012-04-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811662016033', '15593520', 'ANGIE GENESIS', 'CRUZ GABRIEL', '2012-03-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016030', '14310447', 'LUCAS', 'CUELLAR AÑEZ', '2012-03-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016033', '14412218', 'JOSUE', 'FARELL CAMACHO', '2011-11-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809822016021', '13785343', 'WILFREDO', 'GONZALES FLORES', '2012-04-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144920176987', '13109743', 'LUCAS DIEGO', 'GRAGEDA RUIZ', '2011-07-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912018059', '15113354', 'ANGELO ADRIAN', 'GUERRERO CONDORETTY', '2011-06-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812052016030', '14871626', 'JOSHIE ELIZABETH', 'HURTADO PALOMEQUE', '2012-06-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016022', '12987113', 'NICOLAS', 'JACINTO LEYGUE', '2011-09-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802322016021', '13209798', 'MARCO ANTONIO', 'JALDIN SOLARES', '2012-06-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372016013', '14130602', 'MIA', 'LANDIVAR TERCEROS', '2012-03-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402016003', '12984047', 'ALEJANDRO', 'MARTINEZ IBARRA', '2011-11-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981064201664212', '16753985', 'ELISA TATIANA', 'MENACHO HERRERA', '2012-03-21', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016031', '14777290', 'XIHOMARA', 'MERCADO MARAZ', '2011-08-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809822016028', '14162494', 'MAITE CRISTINA', 'MIRANDA BARRETO', '2011-10-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811212016059', '15738506', 'FRANCISCO', 'MURILLO ESPINOZA', '2012-02-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815362015152', '12920269', 'MARIA JOSE', 'ORTUÑO BAQUEROS', '2011-09-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812162016020', '13173625', 'ANTHONY MISAEL', 'PANIAGUA VIZA', '2012-02-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154695', '13962961', 'JOSE FERNANDO', 'PAÑUNI CHAMBI', '2011-05-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017027', '14746173', 'YARITA EULALIA', 'PEÑA MERCADO', '2011-09-21', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802602016067', '14995132', 'MONSERRAT', 'RIVERO PEÑA', '2011-11-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016004', '13142582', 'LUIS RAUL', 'RIVERO SEN', '2011-11-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811092016040', '12728789', 'OLGA CLARETH', 'SAAVEDRA PEREZ', '2011-09-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '319200422016010', '12603285', 'ALEXIA MAYLETH', 'VILLA VALDEZ', '2011-09-30', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814492017143', '16805169', 'SOFIA CAMILA', 'YAVITA GOMEZ', '2011-09-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Tercero B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 11 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198131420175213', '14456770', 'RISSEL', 'ABURDENE TIBUBAY', '2011-10-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815492016005', '13634957', 'THALIANA', 'AGUILERA LAMAS', '2011-12-12', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016008', '13207093', 'SARA VALENTINA', 'AGUILERA MARTINEZ', '2012-06-09', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819803262016012', '13476361', 'AINOHA YOHANDRA', 'AQUINO ANDIA', '2011-10-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802602016078', '14087604', 'CARLOS EMILIO', 'BALDELOMAR CARREÑO', '2012-03-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811462016003', '14053822', 'MAITTE JHULIANA', 'BIAGAZO VELASCO', '2012-06-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402016009', '13396894', 'AYLEN NATANIA', 'BORDA URGEL', '2011-09-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981191201635010', '15904500', 'HEIDY LARISSA', 'CHOQUE LAURA', '2011-11-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809822016093', '12662533', 'MISHEL VALENTINA', 'CHOQUE QUISPE', '2012-04-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016024', '13370281', 'JOSUE CALEB', 'CONDORI LOPEZ', '2011-11-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811492016002', '15929465', 'JOEL FABRICIO', 'DELGADO RAMIREZ', '2011-07-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814882016019', '12447950', 'PABLO LEONARDO', 'ECHALAR ORTIZ', '2011-08-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812432016013', '12729278', 'LUCAS JOEL', 'MAREÑO CLAROS', '2012-05-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016023', '14932040', 'GAEL ALFREDO', 'MIRANDA AGUILERA', '2011-08-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016017', '13729252', 'IHAM JHAMIR', 'MONTAÑO CALVI', '2012-03-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815362016004', '10991896', 'DANNIA LARISSA', 'MONTAÑO SEJAS', '2012-06-30', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819813272016004', '14786916', 'MATIAS', 'MUÑOZ CUELLAR', '2012-03-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815592016024', '15047013', 'ABRIL DAYRA', 'ORTIZ CEREZO', '2012-03-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980117201606757', '15251215', 'MARINA IYARID', 'PAZ CORRALES', '2012-04-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802332018005', '13429956', 'OTTO JOADEL', 'PEÑA ELENA', '2011-09-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812192016024', '14088134', 'EMILIANO', 'PIÑEROS CALDERON', '2011-09-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819805832017002', '14942670', 'CALEB ELIAS', 'RAMOS MORALES', '2012-01-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402016034', '12795400', 'LEANDRO', 'RIBERA RUEDA', '2012-06-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980875201653527', '14433741', 'MATEO', 'RIVERO ROLDAN', '2012-01-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802322016053', '13271474', 'MARK ROBERT', 'RUIZ RUIZ', '2012-06-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810432016014', '14633981', 'KIARA DIHAMELY', 'SALVATIERRA REYES', '2011-10-19', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372016025', '14633809', 'FRANZ ASAEL', 'SANDOVAL AGUILAR', '2012-02-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912016009', '12761678', 'ALEXANDER', 'SANTA CRUZ LANGUIDEY', '2011-11-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802612016124', '13333993', 'RAFAEL MATEO', 'SOLETO GUARDIA', '2011-09-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810832016067', '15489940', 'SANTIAGO', 'SOLIZ LIMPIAS', '2012-03-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802612016090', '14253688', 'AMELIA SOFIA', 'TABORGA CABRERA', '2011-12-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819800352017004', '12656678', 'RUBEN MATEO', 'TORRES GUINEART', '2012-05-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198124120151569', '12660758', 'JOSE CARLOS', 'TORRES JALDIN', '2011-04-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802612016095', '13974155', 'ANDRES', 'VERAMENDI MAMANI', '2012-02-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Cuarto A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 12 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981083201514324', '14453881', 'LUCAS SAID', 'ALGARAÑAZ MONTERO', '2011-04-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152464', '13635284', 'CIARA ALEXANDRA', 'ALVAREZ LARA', '2010-07-30', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815402015237', '13975378', 'JOSE DAVID', 'ALVAREZ PADILLA', '2010-09-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8048007420154019', 'S/CI-8048007420154019', 'FABIANA NICOLE', 'AMACHUY COPA', '2011-05-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220151984', '14773116', 'BELEN ANDREA', 'ANGELO MORO', '2011-03-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154661', '13144339', 'FREDDY', 'AVILA TORREZ', '2010-09-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198097820152469', '13976129', 'MARIA RENEE', 'BEJARANO BARBA', '2011-01-07', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811192016019', '14995327', 'LEANDRO DANIEL', 'CANIDO TERRAZAS', '2011-03-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154619', '12850977', 'EILEEN', 'DOMINGUEZ MOGROVEJO', '2010-10-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819805452015117', '14103209', 'SEBASTIAN KIOSHY', 'FLORES AGUILAR', '2010-08-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198000820156311', '13434171', 'RONNY SANTIAGO', 'LIJERON DELGADILLO', '2011-02-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198110320154506', '13980637', 'CRISTIAN MATIAS', 'LUIZAGA DAZA', '2011-06-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802512016045', '15275020', 'YONATAN ISRAEL', 'MAGNE ALCOBA', '2010-10-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152540', '15525038', 'ZAHIR', 'MENDOZA SALVATIERRA', '2010-07-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198097720132286', '16785337', 'ANTONIO', 'OLMOS MENDEZ', '2009-06-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198155920153048', '15046978', 'CARLA YANDY', 'ORTIZ CEREZO', '2010-09-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152589', '14690920', 'ISAIAS', 'PAREJA MENDEZ', '2010-10-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815492015367', '15289425', 'MATEO', 'PAZ HURTADO', '2011-04-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220152039', '14772832', 'JHANAYHA LENY', 'PINTO MEDINA', '2011-05-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154843', '14138362', 'JUAN PABLO', 'POZO AGUILERA', '2011-06-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198090620151579', '13638568', 'ISAAC ASAEL', 'PRADO BUSTILLOS', '2011-06-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981198201512A', '15871790', 'CARLA TAIS', 'REYEROS RAMIREZ', '2011-04-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402015398', '14135830', 'JOSE CARLOS', 'ROCHA ANTELO', '2010-11-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '719200622015792', '11378481', 'KAMILA KEILA', 'RUIZ GOMEZ', '2010-09-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152665', '15951456', 'SAMUEL JOAB', 'SALVATIERRA ARCE', '2011-03-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154805', '14433677', 'LUIS GAMALIEL', 'SANDOVAL PEREIRA', '2011-05-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814952016009', '12358556', 'RAFAELA', 'SEGOVIA CORTEZ', '2011-05-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814492016050', '14689153', 'LUCIANA NICOLE', 'SUAREZ PAZ', '2011-03-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198098220151773A', '10980726', 'SERGIO ERNESTO', 'VARGAS PAREDES', '2010-07-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980687201526', '13635249', 'SHEILA', 'VILAJA GUTIERREZ', '2011-06-20', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981487201582', '13435315', 'VALERIA', 'VILLALOBOS CARDOZO', '2011-02-25', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Cuarto B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 12 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198147420131466', '13146213', 'SARA', 'AÑEZ BERTON', '2010-03-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026020151930', '14750768', 'RAFAEL', 'ARZE MENDEZ', '2010-10-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802612015176A', '11393694', 'CARLOS SEBASTIAN', 'CABRERA SALAS', '2011-04-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198113520158434', '14386356', 'SANTIAGO', 'CARRILLO SORIA', '2011-03-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981134201410514', '12885687', 'SAID ABDIEL', 'CEREZO ARROYO', '2011-03-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819805402017001', '15635531', 'ARLETH JHOANNA', 'CHOQUE DIAZ', '2010-10-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812612015808A', '13779741', 'MAYLI', 'CHUMACERO PEREZ', '2010-08-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '80730551201595', '13144872', 'JENNIFER', 'CRUZ PADILLA', '2011-04-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154752', '14474040', 'JOSE DAVID', 'FLORES MARTINEZ', '2011-02-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8223009820156528', '13990437', 'RENATA', 'GAMARRA MELGAR', '2010-09-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912017038', 'S/CI-819811912017038', 'MADELEINE NOELI', 'GARCIA FERNANDEZ', '2010-05-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '4073029620157389', '11546139', 'LUCIANO MARTIN', 'HIDALGO ARUQUIPA', '2010-07-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980239201580A', '15877349', 'ALEXANDER', 'LOPEZ CORONADO', '2011-03-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026020152300', '14102647', 'SHARIK JASIEL', 'MAGNE CORIA', '2010-11-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152536', '14565927', 'JERSON JUNIOR', 'MENA HINOJOSA', '2010-07-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220156550', '10984089', 'ANGEL DAVID', 'MENDOZA BECERRA', '2011-05-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198156020151690', '14708084', 'JOSE ERNESTO', 'MOYE PEREZ', '2010-07-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810432015896', '14633980', 'RAUL', 'NEGRETE SOLANO', '2011-02-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '813700012016016', '14715073', 'JOSE MANUEL', 'PEREZ NINA', '2010-12-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402015564', '12794929', 'ADRIANA', 'RIBERA RUEDA', '2011-01-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152627', '12884850', 'ESTHER TAIS', 'RIOS AGUIRRE', '2011-04-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198001720151674', '16142235', 'ARIANNE NAYELY', 'RODRIGUEZ TAPIA', '2010-07-26', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981134201512770', '12949110', 'DIANA FERNANDA', 'ROMAN CARREÑO', '2010-08-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152684', '15966006', 'ANTHONELA ISABELLA', 'SEJAS ALVAREZ', '2010-07-22', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198134420158537', '14084724', 'CHRISTIAN', 'SOLOGUREN NUÑEZ', '2011-03-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '7068004520155784', '14402563', 'OSCAR DANIEL', 'SOTO ELENA', '2010-09-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '519800202015195A', '14810980', 'NICOLAS', 'SUAREZ MONTENEGRO', '2011-01-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198145120152023', '12859051', 'BRUNO', 'SUAREZ VASQUEZ', '2010-07-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198114920156946', '14874658', 'FANNY GALILEA', 'TABOADA CESPEDES', '2010-07-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Cuarto C
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 12 AND section = 'C' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154680', '13730090', 'RUBERTH', 'AGUILERA LEAÑOS', '2011-03-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981121201512629', '14588489', 'NATHALIA', 'ANDIA AGUILAR', '2011-03-24', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154676', '13371233', 'MARIA JOSE', 'ARAUZ OTTERBURG', '2011-04-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981243201569', '16987892', 'IVANA ISABELLA', 'BLANCO TOTORA', '2011-02-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811732015438', '13304969', 'ABRAHAN', 'CANAVIRI VEGA', '2011-04-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198122520155000', '13146960', 'JAVIER BRUNO', 'CASUPA MURILLO', '2011-01-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154623', '13289196', 'VIVIAN LUCIANA', 'CHALLAPA CONDORI', '2011-05-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198131220156195', '12418195', 'MISAEL', 'CORTEZ CHAVEZ', '2011-06-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814952015216', '13634404', 'KARLA VARINIA', 'DAZA SALVATIERRA', '2011-04-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220152024', '13977427', 'CAMILA ANTHONELA', 'EGUEZ VEIZAGA', '2010-08-21', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152502', '15951406', 'CARLOS ANDRES', 'GONZALES SEJAS', '2010-10-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152517', '15943747', 'JAIRO FRANCISCO', 'JIMENEZ MONTAÑO', '2010-12-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198111820155129', '13729030', 'ABIGAIL', 'JUSTINIANO CALLAU', '2010-10-08', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154729', '11395848', 'DAIRA', 'LANDIVAR SAUCEDO', '2011-05-20', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802392016011', '14433800', 'SEBASTIAN HORACIO', 'MONTERO VILLALBA', '2011-03-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811732015651', '13016194', 'SAMUEL ISAI', 'MORALES BERNAL', '2011-03-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819808682016024', '15461806', 'SANTIAGO RAUL', 'NAVA CAREAGA', '2011-05-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802392016012', '15129967', 'CAMILA', 'NUÑEZ FLORES', '2011-03-04', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815492015351', '15289421', 'FABRIZIO', 'PAZ HURTADO', '2011-04-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720152593', '15128717', 'JOSE MAURICIO', 'PEDRAZA MACHUA', '2011-01-24', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980982201518657', '13546781', 'MICHELLE KENNYA', 'PRIETO CORONEL', '2010-09-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154839', '14409195', 'NICOLAS REYES', 'QUISBERT CORTEZ', '2011-06-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198143020152113', '12884614', 'REGORS LUIS', 'RIOS ESTEVEZ', '2010-07-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198151420159633', '12727585', 'MIA ISABELLA', 'ROCHA ORDOÑEZ', '2010-11-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026020152133', '14471410', 'LEONARDO', 'ROJAS RIOS', '2011-01-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811322016194', '13207398', 'RICARDO', 'ROJAS YUCO', '2010-08-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402016043', '14936128', 'CARLOS MATIAS', 'SUAREZ TABOADA', '2011-06-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154786', '14097765', 'MIA ANDREA', 'VEIZAGA FERNANDEZ', '2011-04-20', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Quinto A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 13 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809772014512', '13306500', 'DIEGO', 'ALEMAN RODRIGUEZ', '2010-06-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402014385', '12726074', 'LUCAS', 'AZOGUE LEIGUE', '2009-10-18', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '818500432014246', '13112129', 'SHELOMI EDME', 'CAMACHO CARDENAS', '2010-02-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402014621', '14794654', 'MISAEL RENATO', 'CHAVEZ BAYA', '2009-08-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198041820146568', '12986317', 'OLIVER LEANDRO', 'CHAVEZ ROUG', '2009-09-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120154418', '12474885', 'ANGELA CAMILA', 'CLAROS GALLEGO', '2010-01-28', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120144224', '12985557', 'KEIDHY JESSENIA', 'CRUZ HENSEL', '2009-08-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981466201417293', '14770544', 'TIAGO JOAN', 'ENDARA CARDONA', '2009-07-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981497201413620', '13077446', 'JUAN DAVID', 'ESCALANTE HURTADO', '2010-03-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026020142117', '11302854', 'IAN LUCIANO', 'FRANCO ARANIBAR', '2009-08-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814972016099', '13017445', 'SANTIAGO', 'GUTIERREZ MOLINA', '2009-08-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814952014149', '14268580', 'LUCIA JARED', 'JUSTINIANO PADILLA', '2010-01-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981440201437A', '14877944', 'DANA', 'LEIGUE IBAÑEZ', '2009-11-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023920149762', '14134324', 'JONATHAN EDIL', 'LLANOS TROCHE', '2010-01-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372014343A', '7420306', 'ANETTE NAYELI', 'LLANQUE TAPIA', '2010-05-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120150097', '14273369', 'SUSAN MELIZA', 'MAMANI VILLCA', '2010-05-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720143444', '16652415', 'THIAGO BENJAMIN', 'MATIAS RIVERO', '2009-10-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402014530', '16841731', 'FABIANA ALEJANDRA', 'MENDOZA COSTA', '2010-05-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720142448', '13900515', 'DIOGO AMADEO', 'MERCADO ROBLES', '2008-12-31', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8195006620142677', '14596726', 'JHEFERSON', 'NAVIA UGARTE', '2010-03-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198126120141001', '11330065', 'BRUNO', 'ORTIZ LORA', '2010-03-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402014460', '13431167', 'VICTORIA NAZARETH', 'RIBERA HURTADO', '2009-10-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819806282014362', '12760548', 'VICTOR JOSE', 'SAAVEDRA PEREZ', '2010-04-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720153035', '13978005', 'SABRINA LUCIANA', 'SALVATIERRA VACA', '2009-09-15', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120144368', '13900544', 'CARLA LORENA', 'SILES SANCHEZ', '2010-02-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981497201413846', '9795956', 'ELIAS MANUEL', 'TISCO ROJAS', '2009-11-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811102014576', '12358100', 'MATEO', 'URGEL MELGAR', '2009-12-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Quinto B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 13 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023320192126', '16181647', 'MATIAS AGUSTIN', 'CABRERA', '2010-01-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198007620133301', '14141107', 'GENESIS MICHELLE', 'AGUILERA MONTENEGRO', '2009-03-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980110201422', '12419432', 'LUCIANA', 'AGUILERA ZAMORA', '2010-04-03', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198101420141448', '14409785', 'MAILY JUDITH', 'ANGULO MUÑOZ', '2009-05-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819813602015261', '12696045', 'BRUNO', 'ARANDIA ULLOA', '2010-07-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119220171751', '14727198', 'LEAH KATE', 'ARIAS PEREIRA', '2009-01-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980982201699505', '9701974', 'BENJAMIN ADRIAN', 'CHOQUE QUISPE', '2009-03-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120218314', '12611170', 'JUAN DANIEL', 'CHUMACERO SANDI', '2009-12-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198111820182101', '15770531', 'AMANDA BEATRIZ', 'CUELLAR DE SOUZA', '2009-05-08', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981121201512653', '13602690', 'JOAQUIN DAVID', 'DIAZ VELARDE', '2010-02-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '717200312014384A', '12659996', 'ALEXANDER', 'GUERRERO PERALTA', '2010-01-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198087520142149', '16239787', 'EZEQUIEL', 'GUTIERREZ MIRANDA', '2010-02-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120156057', '12948788', 'RAFAELA', 'LA TORRE OLIVARES', '2010-04-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981440201444A', '14694193', 'ZAHIRA', 'MARAZ RIVERO', '2010-05-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198026120141925', '10980582', 'LAURA JUDITH', 'MONASTERIO AYALA', '2009-12-23', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8073046720151111', '13017203', 'KAREN VALENTINA', 'MONTES AVILA', '2010-03-05', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198050620154780', '14633281', 'GRENY RASHELL', 'PARRAGA ALVAREZ', '2010-04-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802392014293', '13839326', 'JOSE MARCO', 'PINTO MEDINA', '2009-10-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120221636', '10942634', 'GANDI INTI', 'PUMA VILLCA', '2009-04-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981132201665383', '14621626', 'CAROLINA VICTORIA', 'QUEZADA RAMIREZ', '2010-05-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819815492014333', '14075718', 'HEBERT OSWALDO', 'ROCHA CHOQUE', '2009-07-17', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198149720142391', '11408173', 'MARIA RENE', 'ROMAN FLORES', '2010-03-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198134620137979', '12384283', 'MARIA JOSE', 'RUIZ GUZMAN', '2010-01-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198126120141088', '13537049', 'LUIS SANTIAGO', 'SARDINA CASIA', '2010-03-31', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81730184201413953', '10688775', 'SAMYAR ANNEL', 'TEJERINA FARFAN', '2009-11-16', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '3192002020151176', '15206440', 'MICAELA YASSIN', 'VISCARRA VARGAS', '2010-05-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Sexto A
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 14 AND section = 'A' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819812612013634', '13720613', 'JESSIKA LUANA', 'AGUILERA URZAGASTE', '2009-01-11', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981037201314', '12725453', 'CARLA ANGELINE', 'ANGLARILL JUSTINIANO', '2009-03-29', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981191201318', '13307440', 'ALVARO JAFET', 'ANZALDO ROJAS', '2008-08-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220163491', '10990748', 'CARLOS FABIAN', 'APONTE GUTIERREZ', '2008-12-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981037201320', '13900098', 'JORGE LUIS', 'ARAUZ CONDORI', '2009-04-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819100052013658', '15777378', 'ALEXANDRA', 'AVILA AVILA', '2009-03-14', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814412014259', '14254197', 'SEBASTIAN', 'BEJARANO SALGUERO', '2008-11-22', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912013269', '13900097', 'MAIRA', 'BERRIOS ROCHA', '2008-10-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198108320147861', '14657223', 'ALINA ABIGAIL', 'CABALLERO VARGAS', '2009-01-04', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981191201324', '12820670', 'KEYLA HEFZIBA', 'CALLAPA HUALLPA', '2008-07-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811732013134', '13307431', 'MATIAS JAEL', 'CANAVIRI VEGA', '2009-03-28', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372013106', '13899778', 'YAHIR SEBASTIAN', 'CARPIO GUZMAN', '2009-03-08', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981134201310030', '13335202', 'ANTONIO JOSE', 'CHAVEZ VICENTE', '2009-06-23', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198131220143567', '11306554', 'HEAVEN', 'CORTEZ CHAVEZ', '2009-01-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802322013154A', '13209957', 'MARIA FERNANDA', 'JALDIN SOLARES', '2009-01-23', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402013190', '14130601', 'AMY', 'LANDIVAR TERCEROS', '2008-08-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198023220145432', '13900009', 'EMMANUEL ANTONIO', 'LOAIZA CARDOZO', '2009-02-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198136220131817', '15275021', 'ABIGAIL NAOMI', 'MAGNE ALCOBA', '2009-04-06', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981134201310662', '12985124', 'THIAGO CRISTOBAL', 'MARTINEZ MARTINEZ', '2009-02-04', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809772013739', '13046699', 'GERMAN', 'MENDIA VARGAS', '2008-08-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912013136', '12960026', 'FELIPE IGNACIO', 'MORALES PAZ', '2008-10-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819810372013270', '12694001', 'THIAGO RENE', 'OVIEDO JUSTINIANO', '2009-01-12', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981110201359A', '13634622', 'YERINN SAID', 'PANIAGUA GOMEZ', '2009-03-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981440201317A', '15251242', 'ESCARLET NICOL', 'PAZ CORRALES', '2009-05-29', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144920145473', '14138303', 'ARIANE YAZIEL', 'PEREZ VALVERDE', '2009-03-19', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '818900652013690', '14355450', 'ANDRES', 'ROSAS GONZALES', '2008-12-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811732013217A', '13780540', 'WILLIAM', 'RUIZ MERIDA', '2009-01-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912013178', '13081631', 'SEBASTIAN FRANCO', 'SANDOVAL ARISPE', '2009-06-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802552013729', '13899866', 'ESTHEFANIA', 'SANTA CRUZ EGUEZ', '2009-02-13', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980539201334A', '12729638', 'JUAN AGUSTIN', 'SANTILLAN RUIZ', '2008-12-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120136469', '13400119', 'MOISES', 'VACA PINTO', '2009-06-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8073028720131244', '13900069', 'YESHUA MAURICIO', 'VILLEGAS ANTONIO', '2009-01-08', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

    -- Curso: Secundaria Comunitaria Productiva - Sexto B
    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = 14 AND section = 'B' AND shift = 'MORNING' LIMIT 1;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198119120144425', '14407879', 'HEBERTH RAFAEL', 'AMAYA BALCAZAR', '2009-07-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981121201313213', '13702040', 'SAMANTHA', 'ANDIA AGUILAR', '2008-06-12', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198088820131084', '9809377', 'DANIEL ARMANDO', 'ANTEZANA AGUILAR', '2009-03-10', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402013185', '13785906', 'JASSIEL', 'BALDIVIEZO RIVERO', '2009-03-30', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402013297', '14632873', 'JULIO CESAR', 'CABRERA BALDELOMAR', '2009-05-21', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198006920131994', '13900517', 'AYELEN RUTH', 'ESCALANTE QUIROGA', '2008-08-16', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819814402013213', '14053207', 'CAMILA FERNANDA', 'EYZAGUIRRE TERCEROS', '2008-12-26', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981191201399', '13304339', 'CAMILA', 'GONZALES ORTIZ', '2009-06-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981132201323350', '14811369', 'KAMILA', 'GUTIERREZ LAMAS', '2008-10-10', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819804872013714', '16756043', 'JIMENA', 'JIMENEZ MENACHO', '2008-11-06', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198093520131182', '16885669', 'ANGELICA', 'LEAÑOS AGUILERA', '2008-11-20', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981549201411A', '9834582', 'JOSE FERNANDO', 'LINO OJEDA', '2008-07-11', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81980239201360', '13900159', 'LEONARDO', 'LOPEZ CORONADO', '2009-06-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198113520125562', '9667344', 'ANA CRISTINA', 'MENDEZ MONTERO', '2008-04-01', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981549201458', '13209527', 'RICARDO', 'MENDIETA VILLALVA', '2008-07-02', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '822300742014445', '13991996', 'JAMES VLADIMIR', 'MERCADO VACA', '2009-02-25', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819802392013179', '13633806', 'NICOLAS', 'MEZA VELASQUEZ', '2009-01-15', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198001720132069', '13977429', 'JHONATAN PAUL', 'MORENO IBAÑEZ', '2009-04-27', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819809062013134A', '13670921', 'ALEXANDER', 'MORON CALDERON', '2008-10-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198123220144631', '14775755', 'MARICELLY JIZELL', 'MOUNZON QUIROGA', '2009-02-03', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981121201313393', '12355910', 'JOSE MANUEL', 'MURILLO ESPINOZA', '2008-03-20', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811732013230', '13729298', 'VALENTINA', 'PEÑA MONJE', '2009-04-27', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819803462014994', '9752368', 'JHON DAIRO', 'RAMIREZ FERREL', '2009-03-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981440201324A', '12359275', 'RICARDO ROY', 'RIVERA CABALLERO', '2008-09-06', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819808882013690', '12507318', 'DANIA NICOLE', 'RODRIGUEZ RODRIGUEZ', '2008-10-17', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '81981132201324426', '13208435', 'RODRIGO', 'ROJAS YUCO', '2009-06-13', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198103720143258', '9786658', 'GENESIS GISSEL', 'SALDIAS ACHIPA', '2009-06-09', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912013199', '13839874', 'WILLY ANTHONY', 'TERRAZAS EGUEZ', '2008-07-14', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912013211', '8482007', 'THIANA MILEY', 'TORREZ BALTAZAR', '2009-01-20', 'FEMALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '819811912013227', '12357261', 'BRUNO SAMUEL', 'VARGAS BRAILCO', '2009-02-05', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144920145492', '12885325', 'LUCAS RAUL', 'VELASCO ROBLES', '2009-05-01', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;
    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '8198144920145507', '14810554', 'GADIEL EDGAR', 'YAVITA GOMEZ', '2009-02-07', 'MALE', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;

END $$;

COMMIT;
