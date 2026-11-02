INSERT INTO "permissions" ("id", "name", "description", "module", "created_at")
VALUES ('alerts-configure-permission', 'alerts:configure', 'Configurar reglas de alertas', 'alerts', CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role", "permission_id", "created_at")
SELECT 'alerts-configure-admin', 'ADMINISTRATIVE', "id", CURRENT_TIMESTAMP
FROM "permissions" WHERE "name" = 'alerts:configure'
ON CONFLICT ("role", "permission_id") DO NOTHING;
