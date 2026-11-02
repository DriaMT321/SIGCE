-- Las cuentas vinculadas directamente a estudiantes son cuentas de estudiante,
-- no cuentas familiares. Se corrigen las creadas por versiones anteriores.
-- Solo se cambian cuentas exclusivas del perfil estudiantil y se invalidan
-- sus tokens de renovación para aplicar el rol actualizado.
DELETE FROM "refresh_tokens" AS token
USING "students" AS estudiante, "users" AS usuario
WHERE estudiante."user_id" = usuario."id"
  AND token."user_id" = usuario."id"
  AND usuario."role" = 'PARENT'
  AND NOT EXISTS (
    SELECT 1 FROM "parents" AS familiar WHERE familiar."user_id" = usuario."id"
  )
  AND NOT EXISTS (
    SELECT 1 FROM "teachers" AS docente WHERE docente."user_id" = usuario."id"
  );

UPDATE "users" AS usuario
SET "role" = 'STUDENT',
    "credential_version" = "credential_version" + 1
FROM "students" AS estudiante
WHERE estudiante."user_id" = usuario."id"
  AND usuario."role" = 'PARENT'
  AND NOT EXISTS (
    SELECT 1 FROM "parents" AS familiar WHERE familiar."user_id" = usuario."id"
  )
  AND NOT EXISTS (
    SELECT 1 FROM "teachers" AS docente WHERE docente."user_id" = usuario."id"
  );
