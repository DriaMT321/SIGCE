BEGIN;

-- Normalize the institutional 1..16 cohort index created by the old
-- reasignar16cursosplanestudio script to Bolivia's formal 1..14 grade scale.
-- Parallel Initial groups remain separate courses through their section.
UPDATE "courses"
SET "grade_level" = 1, "section" = 'A'
WHERE "name" = 'Inicial - Pollito';

UPDATE "courses"
SET "grade_level" = 1, "section" = 'B'
WHERE "name" = 'Inicial - Nidito';

UPDATE "courses"
SET "grade_level" = 1, "section" = 'C'
WHERE "name" = 'Inicial - Pre Kinder';

UPDATE "courses"
SET "grade_level" = 2, "section" = 'B'
WHERE "name" = 'Inicial - Kinder';

UPDATE "courses"
SET "grade_level" = CASE "name"
  WHEN '1º de Primaria' THEN 3
  WHEN '2º de Primaria' THEN 4
  WHEN '3º de Primaria' THEN 5
  WHEN '4º de Primaria' THEN 6
  WHEN '5º de Primaria' THEN 7
  WHEN '6º de Primaria' THEN 8
END
WHERE "name" IN (
  '1º de Primaria', '2º de Primaria', '3º de Primaria',
  '4º de Primaria', '5º de Primaria', '6º de Primaria'
);

UPDATE "courses"
SET "grade_level" = CASE "name"
  WHEN '1º de Secundaria' THEN 9
  WHEN '2º de Secundaria' THEN 10
  WHEN '3º de Secundaria' THEN 11
  WHEN '4º de Secundaria' THEN 12
  WHEN '5º de Secundaria' THEN 13
  WHEN '6º de Secundaria' THEN 14
END
WHERE "name" IN (
  '1º de Secundaria', '2º de Secundaria', '3º de Secundaria',
  '4º de Secundaria', '5º de Secundaria', '6º de Secundaria'
);

-- A 5th/6th secondary ordinal is invalid in the formal scale. Convert any
-- remaining rows only when their target group is free, to avoid merging classes.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "courses" AS legacy
    JOIN "courses" AS target
      ON target."academic_year_id" = legacy."academic_year_id"
     AND target."grade_level" = legacy."grade_level" - 2
     AND target."section" = legacy."section"
     AND target."shift" = legacy."shift"
    WHERE legacy."grade_level" IN (15, 16)
  ) THEN
    RAISE EXCEPTION 'No se normalizaron grados 15/16 porque hay cursos que ocuparían el mismo paralelo. Revise esos cursos manualmente.';
  END IF;

  UPDATE "courses"
  SET "grade_level" = "grade_level" - 2
  WHERE "grade_level" IN (15, 16);
END $$;

-- Course-linked curriculum follows its normalized course grade.
UPDATE "curriculum_topics" AS topic
SET "grade_level" = course."grade_level"
FROM "courses" AS course
WHERE topic."course_id" = course."id"
  AND topic."grade_level" <> course."grade_level";

-- The earlier seed scripts stored standalone topics on the old 4+6+6 scale.
UPDATE "curriculum_topics" AS topic
SET "grade_level" = CASE
  WHEN topic."grade_level" <= 3 THEN 1
  ELSE 2
END
FROM "subjects" AS subject
WHERE topic."subject_id" = subject."id"
  AND topic."course_id" IS NULL
  AND subject."code" = 'DII'
  AND topic."grade_level" BETWEEN 1 AND 4;

UPDATE "curriculum_topics" AS topic
SET "grade_level" = topic."grade_level" - 2
FROM "subjects" AS subject
WHERE topic."subject_id" = subject."id"
  AND topic."course_id" IS NULL
  AND subject."code" <> 'DII'
  AND topic."grade_level" BETWEEN 5 AND 16;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "courses" WHERE "grade_level" NOT BETWEEN 1 AND 14) THEN
    RAISE EXCEPTION 'Quedan cursos fuera de los 14 grados formales; revise el mapeo antes de continuar.';
  END IF;
  IF EXISTS (SELECT 1 FROM "curriculum_topics" WHERE "grade_level" NOT BETWEEN 1 AND 14) THEN
    RAISE EXCEPTION 'Quedan temas curriculares fuera de los 14 grados formales; revise el mapeo antes de continuar.';
  END IF;
END $$;

ALTER TABLE "courses"
ADD CONSTRAINT "courses_grade_level_regular_range"
CHECK ("grade_level" BETWEEN 1 AND 14);

ALTER TABLE "curriculum_topics"
ADD CONSTRAINT "curriculum_topics_grade_level_regular_range"
CHECK ("grade_level" BETWEEN 1 AND 14);

COMMIT;
