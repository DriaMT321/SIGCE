BEGIN;

CREATE TYPE "GradeCorrectionStatus" AS ENUM ('PENDING', 'EXECUTED', 'REJECTED');

CREATE TABLE "grade_correction_requests" (
    "id" TEXT NOT NULL,
    "grade_id" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "decided_by_id" TEXT,
    "previous_value" DOUBLE PRECISION NOT NULL,
    "proposed_value" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "evidence_reference" TEXT NOT NULL,
    "decision_reason" TEXT,
    "status" "GradeCorrectionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_at" TIMESTAMP(3),
    "executed_at" TIMESTAMP(3),

    CONSTRAINT "grade_correction_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "grade_correction_requests_grade_id_status_idx"
  ON "grade_correction_requests"("grade_id", "status");
CREATE INDEX "grade_correction_requests_requested_by_id_created_at_idx"
  ON "grade_correction_requests"("requested_by_id", "created_at");
CREATE INDEX "grade_correction_requests_status_created_at_idx"
  ON "grade_correction_requests"("status", "created_at");
CREATE UNIQUE INDEX "grade_correction_requests_one_pending_per_grade_idx"
  ON "grade_correction_requests"("grade_id")
  WHERE "status" = 'PENDING';

ALTER TABLE "grade_correction_requests"
  ADD CONSTRAINT "grade_correction_requests_grade_id_fkey"
  FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "grade_correction_requests"
  ADD CONSTRAINT "grade_correction_requests_requested_by_id_fkey"
  FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "grade_correction_requests"
  ADD CONSTRAINT "grade_correction_requests_decided_by_id_fkey"
  FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
