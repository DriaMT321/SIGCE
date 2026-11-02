# Sistema de Gestión Académica e Interoperabilidad SIE

> **Proyecto de Grado**: Sistema de Gestión Académica para los procesos de registro, actualización, seguimiento y sincronización con el Sistema de Inscripción Estudiantil (SIE).

---

## Arquitectura del Sistema

El sistema está organizado como un **monolito modular** con un **Worker RPA asíncrono**. En la API y el worker, el código de servidor separa presentación, aplicación, dominio e infraestructura; los casos de uso dependen de puertos y los adaptadores concretos de NestJS, Prisma, BullMQ, Puppeteer y el sistema de archivos quedan en los bordes. Las validaciones HTTP pertenecen a presentación y una prueba automatizada comprueba estas reglas de dependencia.

La API organiza sus módulos por capacidades y límites de contexto. El dominio concentra invariantes de matrícula, calificación, corrección de notas, asistencia y generación horaria; las interacciones entre módulos usan contratos publicados. Los modelos de lectura se mantienen como estructuras simples cuando no tienen comportamiento propio. Esta aplicación de DDD no implica convertir cada tabla en un agregado. El mapa de contextos, sus contratos y los límites comprobados se describen en [la guía de arquitectura Clean Architecture y DDD](docs/arquitectura-clean-ddd.md); el contraste con los requisitos del perfil está en [la auditoría de cumplimiento](docs/auditoria-cumplimiento-perfil.md).

- **Frontend Web (`apps/web`)**: SPA en React 19 + Vite + TypeScript + Tailwind CSS + TanStack Query + React Hook Form + Zod + Socket.IO Client. Estructura orientada a _features_.
- **Backend API (`apps/api`)**: NestJS + TypeScript + PostgreSQL 16 + Prisma ORM + JWT/RBAC + BullMQ + Socket.IO Gateway. Los módulos del backend siguen capas de presentación, aplicación, dominio e infraestructura, con dependencias verificadas mediante pruebas.
- **Worker RPA (`apps/sie-worker`)**: Proceso independiente en TypeScript + BullMQ + Puppeteer (Chromium) para procesar trabajos SIE. La conexión real está protegida por configuración y requiere habilitación explícita.
- **Mobile (`mobile`)**: Aplicación móvil Flutter + Dart + Riverpod + Dio + GoRouter + Flutter Secure Storage + Flutter Local Notifications para padres y tutores (sin dependencias de Firebase).
- **Tipos Compartidos (`packages/shared-types`)**: Paquete TypeScript con enumeraciones, DTOs y eventos de dominio transversales.

### Horarios y norma educativa

El generador semanal crea cinco períodos pedagógicos diarios de 40 minutos para Inicial; Primaria y Secundaria usan seis períodos de 40 minutos en turnos de mañana o tarde, y seis de 35 minutos en turno nocturno. Se trabaja de lunes a viernes y se evitan solapamientos docentes. La distribución por materia se reparte de forma equilibrada entre las asignaciones registradas; debe revisarse frente a la carga curricular aprobada por la unidad educativa. La [RM 0001/2026](https://www.minedu.gob.bo/files/documentos-normativos/resoluciones-ministeriales/1_RM_0001_EDUCACIN_REGULAR.pdf) establece estas duraciones y deja la fijación del horario local a las autoridades correspondientes. Las horas de inicio y los recreos predeterminados en SIGCE son referencias operativas, no una regla nacional; deben contrastarse con el horario aprobado localmente.

Los grados de Educación Regular usan un único catálogo escolarizado: 1-2 Inicial, 3-8 Primaria y 9-14 Secundaria. Corresponde a la duración establecida en los artículos 12-14 de la [Ley 070](https://www.minedu.gob.bo/files/documentos-normativos/leyes/LEY_070_AVELINO_SINANI_ELIZARDO_PEREZ.pdf). Los paralelos y grupos institucionales se identifican con `section`; no se representan como grados adicionales.

```
academic-management/
├── apps/
│   ├── api/                          # Backend NestJS (Clean Architecture / DDD)
│   ├── web/                          # Frontend React 19 + Vite (Feature-Oriented)
│   └── sie-worker/                   # Worker RPA Puppeteer + BullMQ
├── mobile/                           # App móvil Flutter para Padres/Tutores
├── packages/
│   └── shared-types/                 # Tipos, Enums y Eventos compartidos
├── prisma/
│   ├── schema.prisma                 # Fuente de verdad relacional (29 modelos)
│   ├── migrations/                   # Migraciones versionadas en Git
│   └── seed.ts                       # Seed idempotente de desarrollo
├── database/
│   └── schema-reference.sql          # Referencia SQL técnica y académica
├── scripts/
│   └── configurarbasedatos.ts                   # Script automatizado de reconstrucción de BD
├── docker-compose.yml                # Servicios PostgreSQL 16 y Redis 7 Alpine
├── .env.example                      # Plantilla de variables de entorno seguras
├── pnpm-workspace.yaml               # Configuración de Monorepo pnpm
└── README.md                         # Guía de inicialización
```

---

## Requisitos Previos

Asegúrate de tener instalados en tu computadora:

1. **Node.js**: `v20.x` o `v22.x` (LTS recomendado).
2. **pnpm**: `v9.x` o `v10.x` (`npm install -g pnpm`).
3. **Docker** y **Docker Compose**: Para ejecutar PostgreSQL y Redis localmente.
4. **Git**: Para control de versiones.
5. **Flutter SDK** _(opcional para el módulo móvil)_: versión compatible con `mobile/pubspec.yaml`.

---

## Guía de Inicialización en una Computadora Nueva

Sigue estos sencillos pasos tras clonar el repositorio:

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd academic-management
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
# En Windows (PowerShell):
Copy-Item .env.example .env

# En Linux / macOS:
cp .env.example .env
```

En `.env`, define contraseñas locales propias y genera `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` con al menos 32 bytes aleatorios e independientes. La API rechaza los valores JWT ilustrativos al iniciar en producción.

### 4. Levantar servicios de infraestructura (PostgreSQL y Redis)

```bash
docker compose up -d
```

### 5. Inicializar la base local de desarrollo

`db:setup` aplica migraciones y ejecuta el seed. El comando exige confirmar el nombre de la base destino:

```bash
pnpm db:setup -- --confirm-database <nombre-de-base>
```

Este comando automáticamente:

1. Verifica que el nombre confirmado coincida con la base configurada y comprueba la conectividad.
2. Genera el cliente tipado de Prisma.
3. Aplica todas las migraciones SQL versionadas (`prisma migrate deploy`).
4. Ejecuta el Seed con el usuario Administrador y catálogos base.
5. Valida la integridad de las tablas relacionales.

---

## Ejecución en Desarrollo

Puedes levantar cada componente en terminales separadas:

### Backend API (NestJS)

```bash
pnpm dev:api
```

- Servidor HTTP: `http://localhost:3000/api/v1`
- WebSocket Gateway: `http://localhost:3000`

### Frontend Web (React + Vite)

```bash
pnpm dev:web
```

- Aplicación Web: `http://localhost:5173`

### Worker RPA (BullMQ + Puppeteer)

```bash
pnpm dev:worker
```

- Consume trabajos de la cola `sie-synchronization` y ejecuta Chromium headless.

### Aplicación Móvil (Flutter)

```bash
cd mobile
flutter pub get
flutter run -t lib/principal.dart
```

---

## Credenciales de Bootstrap (Desarrollo)

El seed genera automáticamente las siguientes credenciales para pruebas locales:

- **Usuario**: el valor configurado en `SEED_ADMIN_EMAIL`.
- **Contraseña**: el valor configurado en `SEED_ADMIN_PASSWORD`.
- **Rol**: `ADMINISTRATIVE` (Administración y Dirección)

---

## Scripts Globales Disponibles

| Comando                                                                                           | Descripción                                                                                          |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `pnpm build`                                                                                      | Compila todos los paquetes y aplicaciones del monorepo (`shared-types`, `api`, `web`, `sie-worker`). |
| `pnpm test`                                                                                       | Ejecuta las suites de pruebas unitarias con Jest.                                                    |
| `pnpm typecheck`                                                                                  | Ejecuta la verificación estricta de tipos de TypeScript sin emitir código.                           |
| `pnpm format`                                                                                     | Formatea el código de todo el repositorio con Prettier.                                              |
| `pnpm db:generate`                                                                                | Regenera el cliente de Prisma tras modificar `schema.prisma`.                                        |
| `pnpm db:migrate`                                                                                 | Crea y aplica una nueva migración durante desarrollo (`prisma migrate dev`).                         |
| `pnpm db:deploy -- --confirm-database <nombre>`                                                   | Aplica migraciones en la base cuyo nombre confirmaste. Haz un respaldo antes de usarlo.              |
| `pnpm db:seed`                                                                                    | Ejecuta el script de datos iniciales (`seed.ts`).                                                    |
| `pnpm db:setup -- --confirm-database <nombre>`                                                    | Aplica migraciones, ejecuta el seed y verifica la base configurada. Para desarrollo local.           |
| `pnpm db:backup`                                                                                  | Crea un volcado PostgreSQL en formato custom.                                                        |
| `pnpm db:restore -- --backup <archivo.dump> --target-database <nombre> --confirm-target <nombre>` | Restaura el archivo indicado en una base existente dentro de una transacción.                        |
| `pnpm db:reset -- --confirm-database <nombre> --allow-data-loss`                                  | **Destructivo**: elimina y recrea el esquema de la base confirmada.                                  |
| `pnpm db:studio`                                                                                  | Abre la interfaz gráfica Prisma Studio en el navegador.                                              |

---

## Pruebas de Diagnóstico y Automatización

### Prueba de Diagnóstico Puppeteer (Chromium Sandbox)

Para comprobar que el motor de automatización Puppeteer puede inicializar Chromium y procesar páginas sin tocar el SIE real:

```bash
pnpm --filter @academic/sie-worker test:puppeteer
```

---

## Fase 2 — MVP académico funcional

La segunda fase deja operativo el núcleo académico sin conectarse todavía al SIE real:

- API protegida con login por rol, JWT, refresh token rotativo, RBAC y permisos sembrados.
- CRUD y consultas de estudiantes, padres, docentes, gestiones, periodos, materias, cursos y matrículas.
- Registro y actualización auditada de calificaciones y asistencia.
- Alertas por usuario, bitácora de auditoría y filtrado de datos de hijos para familiares.
- Web conectada a REST mediante TanStack Query, formularios React Hook Form + Zod y pantalla de matrículas.
- Móvil conectado a estudiantes, calificaciones, asistencia y alertas mediante Dio.

Rutas REST principales bajo `/api/v1`: `auth`, `students`, `parents`, `teachers`, `academic-years`, `periods`, `subjects`, `courses`, `enrollments`, `grades`, `attendance`, `alerts` y `audit`.

La carga real contra el portal SIE, la comparación bidireccional y la sincronización automática corresponden a la Fase 3.

### Fase 3 inicial sin conexión al SIE

Se implementó el bloque que no depende todavía del portal estatal:

- Las solicitudes de verificación toman calificaciones existentes en PostgreSQL; no crean estudiantes ni notas ficticias.
- Los filtros disponibles para el disparador son curso, materia y periodo académico.
- BullMQ encola un trabajo por calificación y el Worker actualiza estados y auditoría.
- El panel web consulta el historial y recibe los estados `queued`, `started`, `progress`, `verified`, `discrepancy`, `paused` y `failed` mediante Socket.IO.
- Puppeteer trabaja únicamente sobre una página HTML local controlada.
- Los lotes requieren un resumen confirmado, contienen hasta 50 notas, agrupan discrepancias y se pausan si superan el umbral operativo configurado.

La conexión real se habilitará posteriormente mediante un adaptador separado, sin cambiar el caso de uso ni el flujo de la cola.

## Auditoría y Seguridad

- **Autenticación**: JWT Access Token (15m) + Refresh Token rotativo (7d) persistido en BD.
- **Autorización**: RolesGuard + decorador `@Roles()` para control de acceso basado en roles (RBAC).
- **Bitácora de Auditoría**: Toda operación sensible (cambios en calificaciones, asistencias, solicitudes de sincronización y respuestas del SIE) se registra en la entidad `AuditLog` con valores previos, valores nuevos, usuario, fecha e IP de origen.

## Notas de seguridad y arquitectura

- Las credenciales del usuario bootstrap se leen exclusivamente desde `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` en `.env`; no se documentan valores reales en el repositorio.
- `POST /api/v1/auth/refresh` rota refresh tokens almacenados como hashes y `POST /api/v1/auth/revoke` los revoca.
- Los endpoints protegidos combinan `RolesGuard` y `PermissionsGuard`, usando los permisos sembrados en `RolePermission`.
- El Worker publica `sie.sync.started`, `sie.sync.verified`, `sie.sync.discrepancy` y `sie.sync.failed` mediante Redis; el Gateway NestJS los retransmite por Socket.IO.
- El módulo Flutter requiere una instalación del SDK Flutter y las herramientas de cada plataforma destino. Las pruebas unitarias y el análisis estático se ejecutan desde `mobile` con `flutter test` y `flutter analyze`; para compilar Android también se requieren Java y Android SDK.
- `pnpm db:backup` y `pnpm db:restore` usan `pg_dump` y `pg_restore`; los comandos reciben sus argumentos sin interpolar en un shell.
- La restauración exige seleccionar el archivo y repetir el nombre exacto de la base destino. El destino debe existir y la restauración falla entera si encuentra conflictos.
- La auditoría de este repositorio preparó migraciones, pero no las aplicó a una base de datos. Consulta [el procedimiento operativo](docs/operaciones-base-datos.md) antes de desplegarlas.
