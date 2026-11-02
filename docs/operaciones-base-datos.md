# Operaciones de base de datos

## Respaldo

Configura `DATABASE_URL` o las variables `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB` en `.env`. Ejecuta:

```bash
pnpm db:backup
```

El comando requiere `pg_dump` y crea un archivo PostgreSQL custom con extensión `.dump`. Escribe primero en un archivo temporal y publica el respaldo solo cuando el volcado tiene contenido. Por defecto lo guarda en `~/.sigce/backups`; `SIGCE_BACKUP_DIR` permite elegir otro directorio, que debe estar fuera del repositorio. En sistemas POSIX crea el directorio con permisos `0700`, rechaza permisos más amplios y crea el volcado temporal con `0600`. En Windows comprueba que las ACL permitan acceso solo a la cuenta actual, SYSTEM y administradores; un destino personalizado debe cumplir la misma regla. Mantén una copia adicional en otro dispositivo o ubicación.

En POSIX, el destino debe ser un directorio privado con permisos `0700` o más restrictivos; el comando rechaza rutas compartidas sin cambiar sus permisos. Para los puertos locales de Docker Compose, usa Docker Engine 28.0.0 o posterior: versiones anteriores tienen una limitación documentada que puede permitir acceso desde el mismo segmento de red.

## Informes de auditoría SIE

Los informes nuevos se guardan en `~/.sigce/informes-sie`, separado del repositorio. En POSIX, el adaptador crea o exige permisos privados; en Windows, valida que las ACL de la carpeta, los marcadores y los informes limiten el acceso a la cuenta actual, SYSTEM y administradores. Si una ACL no cumple, la operación falla y elimina el archivo recién escrito. El directorio `scratch` anterior deja de ser leído y usado por la aplicación.

Los SQL de carga generados desde datos extraídos se guardan en `~/.sigce/datos-importados` con nombre único y fuera del repositorio. En POSIX, el directorio usa permisos `0700` y el archivo `0600`; en Windows el helper comprueba que las ACL permitan acceso solo a la cuenta actual, SYSTEM y administradores. El generador valida las fechas antes de escribir, conserva como `UNSPECIFIED` el sexo no declarado y traduce el estado de matrícula; rechaza estados que no reconoce. Las cuentas docentes nuevas reciben una clave aleatoria que no se divulga: un administrador debe asignarles una clave desde la gestión de usuarios antes de que puedan iniciar sesión.

## Restauración

La base destino debe existir. Selecciona el volcado explícitamente y confirma el nombre exacto de la base:

```bash
pnpm db:restore -- --backup "database/backups/<respaldo>.dump" --target-database <base-destino> --confirm-target <base-destino>
```

`pg_restore` valida el archivo antes de conectarse y ejecuta todos los cambios dentro de una transacción. El comando no crea ni limpia bases, no busca automáticamente el respaldo más reciente y no ejecuta seeds. Si el archivo choca con objetos existentes, la transacción falla sin dejar una restauración parcial. Para recuperar datos, usa una base vacía creada y revisada por el operador.

## Migraciones

1. Genera un respaldo y verifica que el archivo exista y no esté vacío.
2. Revisa el estado de las migraciones con `pnpm exec prisma migrate status --schema=./prisma/schema.prisma`.
3. Confirma que `.env` apunta al entorno previsto.
4. Aplica las migraciones con `pnpm db:deploy -- --confirm-database <nombre-de-base>`.
5. Revisa los logs y valida los flujos afectados en el entorno correspondiente.

`db:deploy` exige confirmar el nombre de la base configurada. `db:setup` también lo exige y además ejecuta el seed, por lo que está destinado a entornos locales nuevos. La revisión del código no despliega migraciones en una base real.

## Reinicio destructivo

`db:reset` borra el esquema y los datos. Solo se ejecuta con estas dos confirmaciones explícitas:

```bash
pnpm db:reset -- --confirm-database <nombre-de-base> --allow-data-loss
```

Confirma el respaldo y el destino antes de usarlo. No uses este comando en datos institucionales.
