-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AnnouncementUrgency" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "AnnouncementScope" AS ENUM ('COURSE', 'ALL_COURSES', 'PARENT', 'ALL_PARENTS', 'TEACHER', 'ALL_TEACHERS', 'SPECIFIC_PARENTS', 'SPECIFIC_TEACHERS', 'SPECIFIC_STUDENTS');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO');

-- CreateEnum
CREATE TYPE "CurriculumStatus" AS ENUM ('PLANIFICADO', 'EN_DESARROLLO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('TAREA', 'EXAMEN', 'TRABAJO_PRACTICO', 'PROYECTO', 'CONTROL_LECTURA');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'FINALIZADO', 'CANCELADO');

-- AlterTable
ALTER TABLE "alerts" ADD COLUMN     "status" "AlertStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "correlation_id" TEXT,
ADD COLUMN     "reason" TEXT;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "documents" JSONB;

-- CreateTable
CREATE TABLE "class_schedules" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "day_of_week" "DayOfWeek" NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "period_index" INTEGER NOT NULL DEFAULT 1,
    "classroom" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_topics" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "course_id" TEXT,
    "academic_year_id" TEXT NOT NULL,
    "period_number" INTEGER NOT NULL,
    "grade_level" INTEGER NOT NULL,
    "campo" TEXT NOT NULL,
    "unit_title" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "progress_percent" INTEGER NOT NULL DEFAULT 0,
    "status" "CurriculumStatus" NOT NULL DEFAULT 'PLANIFICADO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "AssignmentType" NOT NULL DEFAULT 'TAREA',
    "description" TEXT,
    "due_date" TIMESTAMP(3) NOT NULL,
    "max_score" DOUBLE PRECISION DEFAULT 100,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDIENTE',
    "course_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "urgency" "AnnouncementUrgency" NOT NULL DEFAULT 'MEDIA',
    "scope" "AnnouncementScope" NOT NULL,
    "target_course_id" TEXT,
    "target_parent_id" TEXT,
    "target_teacher_id" TEXT,
    "target_user_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "class_schedules_course_id_idx" ON "class_schedules"("course_id");

-- CreateIndex
CREATE INDEX "class_schedules_teacher_id_idx" ON "class_schedules"("teacher_id");

-- CreateIndex
CREATE INDEX "class_schedules_day_of_week_idx" ON "class_schedules"("day_of_week");

-- CreateIndex
CREATE INDEX "curriculum_topics_subject_id_idx" ON "curriculum_topics"("subject_id");

-- CreateIndex
CREATE INDEX "curriculum_topics_course_id_idx" ON "curriculum_topics"("course_id");

-- CreateIndex
CREATE INDEX "curriculum_topics_grade_level_idx" ON "curriculum_topics"("grade_level");

-- CreateIndex
CREATE INDEX "curriculum_topics_period_number_idx" ON "curriculum_topics"("period_number");

-- CreateIndex
CREATE INDEX "assignments_course_id_idx" ON "assignments"("course_id");

-- CreateIndex
CREATE INDEX "assignments_subject_id_idx" ON "assignments"("subject_id");

-- CreateIndex
CREATE INDEX "assignments_teacher_id_idx" ON "assignments"("teacher_id");

-- CreateIndex
CREATE INDEX "assignments_due_date_idx" ON "assignments"("due_date");

-- CreateIndex
CREATE INDEX "announcements_scope_idx" ON "announcements"("scope");

-- CreateIndex
CREATE INDEX "announcements_urgency_idx" ON "announcements"("urgency");

-- CreateIndex
CREATE INDEX "announcements_created_by_id_idx" ON "announcements"("created_by_id");

-- CreateIndex
CREATE INDEX "announcements_target_course_id_idx" ON "announcements"("target_course_id");

-- CreateIndex
CREATE INDEX "announcements_target_parent_id_idx" ON "announcements"("target_parent_id");

-- CreateIndex
CREATE INDEX "announcements_target_teacher_id_idx" ON "announcements"("target_teacher_id");

-- CreateIndex
CREATE INDEX "alerts_status_idx" ON "alerts"("status");

-- CreateIndex
CREATE INDEX "audit_logs_correlation_id_idx" ON "audit_logs"("correlation_id");

-- AddForeignKey
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_topics" ADD CONSTRAINT "curriculum_topics_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_topics" ADD CONSTRAINT "curriculum_topics_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_topics" ADD CONSTRAINT "curriculum_topics_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_target_course_id_fkey" FOREIGN KEY ("target_course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_target_parent_id_fkey" FOREIGN KEY ("target_parent_id") REFERENCES "parents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_target_teacher_id_fkey" FOREIGN KEY ("target_teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
