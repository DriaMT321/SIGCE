INSERT INTO "permissions" ("id", "name", "description", "module", "created_at")
VALUES
  ('academic-years-create-permission', 'academic-years:create', 'Crear gestiones académicas', 'academic-years', CURRENT_TIMESTAMP),
  ('academic-years-update-permission', 'academic-years:update', 'Actualizar gestiones académicas', 'academic-years', CURRENT_TIMESTAMP),
  ('academic-years-delete-permission', 'academic-years:delete', 'Eliminar gestiones académicas', 'academic-years', CURRENT_TIMESTAMP),
  ('periods-create-permission', 'periods:create', 'Crear periodos académicos', 'periods', CURRENT_TIMESTAMP),
  ('subjects-create-permission', 'subjects:create', 'Crear materias', 'subjects', CURRENT_TIMESTAMP),
  ('subjects-update-permission', 'subjects:update', 'Actualizar materias', 'subjects', CURRENT_TIMESTAMP),
  ('subjects-delete-permission', 'subjects:delete', 'Eliminar materias', 'subjects', CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role", "permission_id", "created_at")
SELECT
  'academic-management-' || lower(replace(p."name", ':', '-')) || '-' || lower(r."role"),
  r."role"::"UserRole",
  p."id",
  CURRENT_TIMESTAMP
FROM "permissions" AS p
CROSS JOIN (VALUES ('ADMINISTRATIVE'), ('SECRETARY')) AS r("role")
WHERE p."name" IN (
  'academic-years:create',
  'academic-years:update',
  'periods:create',
  'subjects:create',
  'subjects:update'
)
ON CONFLICT ("role", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role", "permission_id", "created_at")
SELECT 'academic-years-delete-admin', 'ADMINISTRATIVE', "id", CURRENT_TIMESTAMP
FROM "permissions" WHERE "name" = 'academic-years:delete'
ON CONFLICT ("role", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role", "permission_id", "created_at")
SELECT 'subjects-delete-admin', 'ADMINISTRATIVE', "id", CURRENT_TIMESTAMP
FROM "permissions" WHERE "name" = 'subjects:delete'
ON CONFLICT ("role", "permission_id") DO NOTHING;
