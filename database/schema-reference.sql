-- =============================================================================
-- SISTEMA DE GESTIÓN ACADÉMICA Y SINCRONIZACIÓN SIE
-- SCRIPT SQL DE REFERENCIA TÉCNICA Y ACADÉMICA
-- NOTA: Este archivo es una referencia conceptual de la estructura relacional.
--       La fuente de verdad oficial es: prisma/schema.prisma + prisma/migrations/
-- =============================================================================

-- 1. TIPOS ENUMERADOS (ENUMS)
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT');
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TRANSFERRED', 'GRADUATED', 'WITHDRAWN');
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED');
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'DANGER', 'SUCCESS');
CREATE TYPE "SieSyncStatus" AS ENUM ('PENDING', 'QUEUED', 'PROCESSING', 'VERIFIED', 'FAILED', 'CANCELLED');
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'SYNC_SIE', 'VERIFY_SIE');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');
CREATE TYPE "Shift" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');
CREATE TYPE "RelationshipType" AS ENUM ('FATHER', 'MOTHER', 'GUARDIAN', 'TUTOR', 'OTHER');

-- 2. TABLA: users
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PARENT',
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NULL
);
CREATE INDEX "idx_users_email" ON "users"("email");
CREATE INDEX "idx_users_role" ON "users"("role");
CREATE INDEX "idx_users_is_active" ON "users"("is_active");

-- 3. TABLA: refresh_tokens
CREATE TABLE "refresh_tokens" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "token" VARCHAR(500) NOT NULL UNIQUE,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3) NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "idx_refresh_tokens_user_id" ON "refresh_tokens"("user_id");

-- 4. TABLA: permissions
CREATE TABLE "permissions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "description" VARCHAR(255),
    "module" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA: role_permissions
CREATE TABLE "role_permissions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "role" "UserRole" NOT NULL,
    "permission_id" UUID NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_role_permission" UNIQUE ("role", "permission_id")
);

-- 6. TABLA: students
CREATE TABLE "students" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NULL UNIQUE REFERENCES "users"("id") ON DELETE SET NULL,
    "rude" VARCHAR(50) NOT NULL UNIQUE,
    "ci" VARCHAR(30) NOT NULL UNIQUE,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "birth_date" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "address" VARCHAR(255),
    "phone" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NULL
);
CREATE INDEX "idx_students_rude" ON "students"("rude");
CREATE INDEX "idx_students_ci" ON "students"("ci");
CREATE INDEX "idx_students_names" ON "students"("last_name", "first_name");

-- 7. TABLA: parents
CREATE TABLE "parents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "ci" VARCHAR(30) NOT NULL UNIQUE,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "address" VARCHAR(255),
    "occupation" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NULL
);

-- 8. TABLA: student_parents
CREATE TABLE "student_parents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
    "parentId" UUID NOT NULL REFERENCES "parents"("id") ON DELETE CASCADE,
    "relationship" "RelationshipType" NOT NULL DEFAULT 'TUTOR',
    "is_primary" BOOLEAN NOT NULL DEFAULT FALSE,
    "can_pickup" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_student_parent" UNIQUE ("student_id", "parentId")
);

-- 9. TABLA: teachers
CREATE TABLE "teachers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "ci" VARCHAR(30) NOT NULL UNIQUE,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "specialty" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(50),
    "item_number" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NULL
);

-- 10. TABLA: academic_years
CREATE TABLE "academic_years" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "year" INT NOT NULL UNIQUE,
    "name" VARCHAR(100) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_closed" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. TABLA: academic_periods
CREATE TABLE "academic_periods" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "academic_year_id" UUID NOT NULL REFERENCES "academic_years"("id") ON DELETE CASCADE,
    "name" VARCHAR(50) NOT NULL,
    "number" INT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_period_year_number" UNIQUE ("academic_year_id", "number")
);

-- 12. TABLA: courses
CREATE TABLE "courses" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "academic_year_id" UUID NOT NULL REFERENCES "academic_years"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "grade_level" INT NOT NULL,
    "section" VARCHAR(10) NOT NULL,
    "shift" "Shift" NOT NULL DEFAULT 'MORNING',
    "max_capacity" INT NOT NULL DEFAULT 35,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_course_unique" UNIQUE ("academic_year_id", "grade_level", "section", "shift")
);

-- 13. TABLA: subjects
CREATE TABLE "subjects" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "code" VARCHAR(30) NOT NULL UNIQUE,
    "description" TEXT,
    "area" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. TABLA: teacher_subjects
CREATE TABLE "teacher_subjects" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "teacher_id" UUID NOT NULL REFERENCES "teachers"("id") ON DELETE CASCADE,
    "subject_id" UUID NOT NULL REFERENCES "subjects"("id") ON DELETE CASCADE,
    "course_id" UUID NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "academic_year_id" UUID NOT NULL REFERENCES "academic_years"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_teacher_subject_course" UNIQUE ("teacher_id", "subject_id", "course_id", "academic_year_id")
);

-- 15. TABLA: enrollments
CREATE TABLE "enrollments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
    "course_id" UUID NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "academic_year_id" UUID NOT NULL REFERENCES "academic_years"("id") ON DELETE CASCADE,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_enrollment_student_year" UNIQUE ("student_id", "academic_year_id")
);

-- 16. TABLA: grades
CREATE TABLE "grades" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "enrollment_id" UUID NOT NULL REFERENCES "enrollments"("id") ON DELETE CASCADE,
    "student_id" UUID NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
    "subject_id" UUID NOT NULL REFERENCES "subjects"("id") ON DELETE CASCADE,
    "period_id" UUID NOT NULL REFERENCES "academic_periods"("id") ON DELETE CASCADE,
    "value" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_grade_student_subject_period" UNIQUE ("student_id", "subject_id", "period_id")
);

-- 17. TABLA: attendances
CREATE TABLE "attendances" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
    "course_id" UUID NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "registered_by_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "justification" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_attendance_student_course_date" UNIQUE ("student_id", "course_id", "date")
);

-- 18. TABLA: alerts
CREATE TABLE "alerts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "is_read" BOOLEAN NOT NULL DEFAULT FALSE,
    "link" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 19. TABLA: audit_logs
CREATE TABLE "audit_logs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NULL REFERENCES "users"("id") ON DELETE SET NULL,
    "action" "AuditAction" NOT NULL,
    "entity" VARCHAR(100) NOT NULL,
    "entity_id" VARCHAR(100) NOT NULL,
    "previous_value" JSONB,
    "new_value" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "idx_audit_logs_user" ON "audit_logs"("user_id");
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs"("entity", "entity_id");
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs"("created_at");

-- 20. TABLA: sie_synchronizations
CREATE TABLE "sie_synchronizations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "requested_by_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "status" "SieSyncStatus" NOT NULL DEFAULT 'PENDING',
    "sync_type" VARCHAR(50) NOT NULL DEFAULT 'GRADES',
    "total_items" INT NOT NULL DEFAULT 0,
    "processed_items" INT NOT NULL DEFAULT 0,
    "error_count" INT NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NULL,
    "completed_at" TIMESTAMP(3) NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 21. TABLA: sie_synchronization_items
CREATE TABLE "sie_synchronization_items" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "synchronization_id" UUID NOT NULL REFERENCES "sie_synchronizations"("id") ON DELETE CASCADE,
    "student_id" UUID NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
    "subject_id" UUID NOT NULL REFERENCES "subjects"("id") ON DELETE CASCADE,
    "period_id" UUID NOT NULL REFERENCES "academic_periods"("id") ON DELETE CASCADE,
    "local_value" DOUBLE PRECISION NOT NULL,
    "sie_value" DOUBLE PRECISION NULL,
    "status" "SieSyncStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "retry_count" INT NOT NULL DEFAULT 0,
    "verified_at" TIMESTAMP(3) NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
