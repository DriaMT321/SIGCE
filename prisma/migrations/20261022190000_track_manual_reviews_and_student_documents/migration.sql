ALTER TABLE "sie_synchronization_items"
  ADD COLUMN "discrepancy_resolved_by_id" TEXT,
  ADD COLUMN "discrepancy_resolved_at" TIMESTAMP(3),
  ADD COLUMN "discrepancy_resolution_reason" TEXT,
  ADD COLUMN "discrepancy_decision" TEXT;

ALTER TABLE "sie_synchronization_items"
  ADD CONSTRAINT "sie_synchronization_items_discrepancy_resolved_by_id_fkey"
  FOREIGN KEY ("discrepancy_resolved_by_id") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "student_document_references" (
  "id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "document_type" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "notes" TEXT,
  "created_by_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "student_document_references_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "student_document_references_student_id_created_at_idx"
  ON "student_document_references"("student_id", "created_at");

ALTER TABLE "student_document_references"
  ADD CONSTRAINT "student_document_references_student_id_fkey"
  FOREIGN KEY ("student_id") REFERENCES "students"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "student_document_references"
  ADD CONSTRAINT "student_document_references_created_by_id_fkey"
  FOREIGN KEY ("created_by_id") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
