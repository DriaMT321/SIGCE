-- CreateTable
CREATE TABLE IF NOT EXISTS "student_transfers" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT,
    "student_id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'SALIENTE',
    "transfer_type" TEXT NOT NULL DEFAULT 'REGULAR',
    "causal" TEXT NOT NULL,
    "causal_details" TEXT,
    "origin_school" TEXT NOT NULL,
    "origin_sie_code" TEXT,
    "destination_school" TEXT NOT NULL,
    "destination_sie_code" TEXT,
    "destination_district" TEXT,
    "destination_department" TEXT,
    "target_grade_course" TEXT,
    "current_trimester" INTEGER NOT NULL DEFAULT 1,
    "grades_snapshot" JSONB,
    "phase" TEXT NOT NULL DEFAULT 'SOLICITAR_RETIRO',
    "status" TEXT NOT NULL DEFAULT 'EN_TRAMITE',
    "distrital_resolution" TEXT,
    "distrital_approval_date" TIMESTAMP(3),
    "sie_sync_deadline" TIMESTAMP(3),
    "sie_sync_completed_at" TIMESTAMP(3),
    "sie_folio_number" TEXT,
    "documents_checklist" JSONB,
    "anti_coercion_certified" BOOLEAN NOT NULL DEFAULT true,
    "solicitante_nombre" TEXT,
    "solicitante_ci" TEXT,
    "solicitante_parentesco" TEXT,
    "solicitante_telefono" TEXT,
    "observations" TEXT,
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "student_transfers_student_id_idx" ON "student_transfers"("student_id");
CREATE INDEX IF NOT EXISTS "student_transfers_academic_year_id_idx" ON "student_transfers"("academic_year_id");
CREATE INDEX IF NOT EXISTS "student_transfers_status_idx" ON "student_transfers"("status");
CREATE INDEX IF NOT EXISTS "student_transfers_phase_idx" ON "student_transfers"("phase");

-- AddForeignKey
ALTER TABLE "student_transfers" ADD CONSTRAINT "student_transfers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "student_transfers" ADD CONSTRAINT "student_transfers_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
