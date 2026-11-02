BEGIN;

ALTER TABLE "users"
ADD COLUMN "credential_version" INTEGER NOT NULL DEFAULT 0;

UPDATE "users"
SET "credential_version" = "credential_version" + 1
WHERE "role" = 'STUDENT'
  AND "password_setup_required" = true;

COMMIT;
