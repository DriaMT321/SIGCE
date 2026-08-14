# Sistema de Gestión Académica e Interoperabilidad SIE

> **Proyecto de Grado**: Sistema de Gestión Académica para los procesos de registro, actualización, seguimiento y sincronización con el Sistema de Inscripción Estudiantil (SIE).

---

## 🏛️ Arquitectura del Sistema

El proyecto está diseñado bajo los principios de **Clean Architecture** y **Domain-Driven Design (DDD)** implementado como un **Monolito Modular** y un **Worker RPA asíncrono** independiente:

- **Frontend Web (`apps/web`)**: SPA en React 19 + Vite + TypeScript + Tailwind CSS + TanStack Query + React Hook Form + Zod + Socket.IO Client. Estructura orientada a *features*.
- **Backend API (`apps/api`)**: NestJS + TypeScript + PostgreSQL 16 + Prisma ORM + JWT/RBAC + BullMQ + Socket.IO Gateway. Separación estricta en capas `domain`, `application`, `infrastructure` y `presentation`.
- **Worker RPA (`apps/sie-worker`)**: Proceso independiente en TypeScript + BullMQ + Puppeteer (Chromium) para automatización, interoperabilidad y verificación bidireccional contra el portal SIE.
- **Mobile (`mobile`)**: Aplicación móvil Flutter + Dart + Riverpod + Dio + GoRouter + Flutter Secure Storage + Flutter Local Notifications para padres y tutores (sin dependencias de Firebase).
- **Tipos Compartidos (`packages/shared-types`)**: Paquete TypeScript con enums, DTOs y eventos de dominio transversales.

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
│   ├── schema.prisma                 # Fuente de verdad relacional (~20 entidades)
│   ├── migrations/                   # Migraciones versionadas en Git
│   └── seed.ts                       # Seed idempotente de desarrollo
├── database/
│   └── schema-reference.sql          # Referencia SQL técnica y académica
├── scripts/
│   └── db-setup.ts                   # Script automatizado de reconstrucción de BD
├── docker-compose.yml                # Servicios PostgreSQL 16 y Redis 7 Alpine
├── .env.example                      # Plantilla de variables de entorno seguras
├── pnpm-workspace.yaml               # Configuración de Monorepo pnpm
└── README.md                         # Guía de inicialización
```

---

## 🚀 Requisitos Previos

Asegúrate de tener instalados en tu computadora:

1. **Node.js**: `v20.x` o `v22.x` (LTS recomendado).
2. **pnpm**: `v9.x` o `v10.x` (`npm install -g pnpm`).
3. **Docker** y **Docker Compose**: Para ejecutar PostgreSQL y Redis localmente.
4. **Git**: Para control de versiones.
5. **Flutter SDK** *(opcional para el módulo móvil)*: `v3.24+`.

---

## 💻 Guía de Inicialización en una Computadora Nueva

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

### 4. Levantar servicios de infraestructura (PostgreSQL y Redis)

```bash
docker compose up -d
```

### 5. Inicializar la base de datos (Migraciones + Seed)

Ejecuta el comando automatizado `db:setup`:

```bash
pnpm db:setup
```

Este comando automáticamente:
1. Verifica la conectividad con PostgreSQL.
2. Genera el cliente tipado de Prisma.
3. Aplica todas las migraciones SQL versionadas (`prisma migrate deploy`).
4. Ejecuta el Seed con el usuario Administrador y catálogos base.
5. Valida la integridad de las tablas relacionales.

---

## 🏃‍♂️ Ejecución en Desarrollo

Puedes levantar cada componente en terminales separadas:

### 🟢 Backend API (NestJS)
```bash
pnpm dev:api
```
- Servidor HTTP: `http://localhost:3000/api/v1`
- WebSocket Gateway: `http://localhost:3000`

### 🔵 Frontend Web (React + Vite)
```bash
pnpm dev:web
```
- Aplicación Web: `http://localhost:5173`

### 🤖 Worker RPA (BullMQ + Puppeteer)
```bash
pnpm dev:worker
```
- Consume trabajos de la cola `sie-synchronization` y ejecuta Chromium headless.

### 📱 Aplicación Móvil (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

---

## 🔑 Credenciales de Bootstrap (Desarrollo)

El seed genera automáticamente las siguientes credenciales para pruebas locales:

- **Usuario**: el valor configurado en `SEED_ADMIN_EMAIL`.
- **Contraseña**: el valor configurado en `SEED_ADMIN_PASSWORD`.
- **Rol**: `ADMIN`

---

## 📜 Scripts Globales Disponibles

| Comando | Descripción |
|---|---|
| `pnpm build` | Compila todos los paquetes y aplicaciones del monorepo (`shared-types`, `api`, `web`, `sie-worker`). |
| `pnpm test` | Ejecuta las suites de pruebas unitarias con Jest. |
| `pnpm typecheck` | Ejecuta la verificación estricta de tipos de TypeScript sin emitir código. |
| `pnpm format` | Formatea el código de todo el repositorio con Prettier. |
| `pnpm db:generate` | Regenera el cliente de Prisma tras modificar `schema.prisma`. |
| `pnpm db:migrate` | Crea y aplica una nueva migración durante desarrollo (`prisma migrate dev`). |
| `pnpm db:deploy` | Aplica migraciones pendientes en un entorno nuevo o servidor. |
| `pnpm db:seed` | Ejecuta el script de datos iniciales (`seed.ts`). |
| `pnpm db:setup` | Reconstruye y verifica la base de datos de manera automatizada. |
| `pnpm db:reset` | **Destructivo (Dev)**: Destruye el esquema y lo recrea desde cero. |
| `pnpm db:studio` | Abre la interfaz gráfica Prisma Studio en el navegador. |

---

## 🧪 Pruebas de Diagnóstico y Automatización

### Prueba de Diagnóstico Puppeteer (Chromium Sandbox)
Para comprobar que el motor de automatización Puppeteer puede inicializar Chromium y procesar páginas sin tocar el SIE real:
```bash
pnpm --filter @academic/sie-worker test:puppeteer
```

---

## 🔒 Auditoría y Seguridad

- **Autenticación**: JWT Access Token (15m) + Refresh Token rotativo (7d) persistido en BD.
- **Autorización**: RolesGuard + decorador `@Roles()` para control de acceso basado en roles (RBAC).
- **Bitácora de Auditoría**: Toda operación sensible (cambios en calificaciones, asistencias, solicitudes de sincronización y respuestas del SIE) se registra en la entidad `AuditLog` con valores previos, valores nuevos, usuario, fecha e IP de origen.

## Notas de seguridad y arquitectura

- Las credenciales del usuario bootstrap se leen exclusivamente desde `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` en `.env`; no se documentan valores reales en el repositorio.
- `POST /api/v1/auth/refresh` rota refresh tokens almacenados como hashes y `POST /api/v1/auth/revoke` los revoca.
- Los endpoints protegidos combinan `RolesGuard` y `PermissionsGuard`, usando los permisos sembrados en `RolePermission`.
- El Worker publica `sie.sync.started`, `sie.sync.verified` y `sie.sync.failed` mediante Redis; el Gateway NestJS los retransmite por Socket.IO.
- El proyecto Flutter incluye las plataformas Android, iOS, Web, Linux, macOS y Windows. La verificación local requiere una instalación funcional del SDK Flutter.
