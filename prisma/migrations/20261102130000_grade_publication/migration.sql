ALTER TABLE "grades" ADD COLUMN "published_at" TIMESTAMP(3);
ALTER TABLE "grades" ADD COLUMN "published_by_id" TEXT;

CREATE INDEX "grades_published_at_idx" ON "grades"("published_at");

INSERT INTO "permissions" ("id", "name", "description", "module", "created_at")
VALUES ('grades-publish-permission', 'grades:publish', 'Publicar calificaciones para familias y estudiantes', 'grades', CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role", "permission_id", "created_at")
SELECT
  'grades-publish-' || lower(r."role"),
  r."role"::"UserRole",
  p."id",
  CURRENT_TIMESTAMP
FROM "permissions" AS p
CROSS JOIN (VALUES ('ADMINISTRATIVE'), ('SECRETARY'), ('TEACHER')) AS r("role")
WHERE p."name" = 'grades:publish'
ON CONFLICT ("role", "permission_id") DO NOTHING;
