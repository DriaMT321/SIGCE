BEGIN;

UPDATE "users" AS account
SET
  "role" = 'STUDENT',
  "password_setup_required" = true,
  "password_setup_token_hash" = NULL,
  "password_setup_expires_at" = NULL
WHERE account."id" IN (
  SELECT student."user_id"
  FROM "students" AS student
  WHERE student."user_id" IS NOT NULL
)
AND account."role" = 'PARENT'
AND NOT EXISTS (
  SELECT 1 FROM "parents" AS parent WHERE parent."user_id" = account."id"
)
AND NOT EXISTS (
  SELECT 1 FROM "teachers" AS teacher WHERE teacher."user_id" = account."id"
);

UPDATE "refresh_tokens"
SET "revoked_at" = CURRENT_TIMESTAMP
WHERE "user_id" IN (
  SELECT "id"
  FROM "users"
  WHERE "role" = 'STUDENT'
    AND "password_setup_required" = true
)
AND "revoked_at" IS NULL;

COMMIT;
