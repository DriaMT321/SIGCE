CREATE TYPE "AcademicEventType" AS ENUM (
  'ACTIVIDAD',
  'REUNION',
  'ACTO_ESCOLAR',
  'SUSPENSION_CLASES',
  'OTRO'
);

CREATE TYPE "AcademicEventStatus" AS ENUM (
  'PROGRAMADO',
  'CANCELADO',
  'REALIZADO'
);

CREATE TABLE "academic_events" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "type" "AcademicEventType" NOT NULL DEFAULT 'ACTIVIDAD',
  "starts_at" TIMESTAMP(3) NOT NULL,
  "ends_at" TIMESTAMP(3) NOT NULL,
  "all_day" BOOLEAN NOT NULL DEFAULT false,
  "location" TEXT,
  "status" "AcademicEventStatus" NOT NULL DEFAULT 'PROGRAMADO',
  "target_course_id" TEXT,
  "created_by_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "academic_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "academic_events_starts_at_ends_at_idx"
  ON "academic_events"("starts_at", "ends_at");
CREATE INDEX "academic_events_target_course_id_starts_at_idx"
  ON "academic_events"("target_course_id", "starts_at");
CREATE INDEX "academic_events_status_starts_at_idx"
  ON "academic_events"("status", "starts_at");
CREATE INDEX "academic_events_created_by_id_idx"
  ON "academic_events"("created_by_id");

ALTER TABLE "academic_events"
  ADD CONSTRAINT "academic_events_target_course_id_fkey"
  FOREIGN KEY ("target_course_id") REFERENCES "courses"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "academic_events"
  ADD CONSTRAINT "academic_events_created_by_id_fkey"
  FOREIGN KEY ("created_by_id") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
