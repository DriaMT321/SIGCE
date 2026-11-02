-- Unifica los perfiles de Administración y Dirección aprobados en la validación del proyecto.
-- Las cuentas y permisos existentes se conservan bajo el nuevo rol único.

DELETE FROM "role_permissions" AS director_permission
USING "role_permissions" AS administrator_permission
WHERE director_permission."role" = 'DIRECTOR'
  AND administrator_permission."role" = 'ADMIN'
  AND director_permission."permission_id" = administrator_permission."permission_id";

ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TYPE "UserRole" RENAME TO "UserRole_legacy";
CREATE TYPE "UserRole" AS ENUM (
  'ADMINISTRATIVE',
  'SECRETARY',
  'TEACHER',
  'PARENT',
  'STUDENT'
);

ALTER TABLE "users"
  ALTER COLUMN "role" TYPE "UserRole"
  USING (
    CASE
      WHEN "role"::text IN ('ADMIN', 'DIRECTOR', 'ADMINISTRATIVE') THEN 'ADMINISTRATIVE'
      ELSE "role"::text
    END
  )::"UserRole";

ALTER TABLE "role_permissions"
  ALTER COLUMN "role" TYPE "UserRole"
  USING (
    CASE
      WHEN "role"::text IN ('ADMIN', 'DIRECTOR', 'ADMINISTRATIVE') THEN 'ADMINISTRATIVE'
      ELSE "role"::text
    END
  )::"UserRole";

ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'PARENT'::"UserRole";
DROP TYPE "UserRole_legacy";
