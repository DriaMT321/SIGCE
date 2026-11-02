BEGIN;

CREATE TYPE "AlertRuleType" AS ENUM ('LOW_GRADE', 'REPEATED_ABSENCE');

ALTER TABLE "alerts"
  ADD COLUMN "student_id" TEXT,
  ADD COLUMN "rule_key" "AlertRuleType",
  ADD COLUMN "deduplication_key" TEXT;

CREATE INDEX "alerts_student_id_created_at_idx"
  ON "alerts"("student_id", "created_at");
CREATE UNIQUE INDEX "alerts_user_id_deduplication_key_key"
  ON "alerts"("user_id", "deduplication_key");

ALTER TABLE "alerts"
  ADD CONSTRAINT "alerts_student_id_fkey"
  FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "alert_rules" (
  "id" TEXT NOT NULL,
  "key" "AlertRuleType" NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "severity" "AlertSeverity" NOT NULL DEFAULT 'WARNING',
  "grade_threshold" DOUBLE PRECISION,
  "absence_threshold" INTEGER,
  "absence_window_days" INTEGER,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "alert_rules_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "alert_rules_key_key" ON "alert_rules"("key");

INSERT INTO "alert_rules" (
  "id", "key", "enabled", "severity", "grade_threshold",
  "absence_threshold", "absence_window_days", "updated_at"
) VALUES
  ('LOW_GRADE', 'LOW_GRADE', true, 'WARNING', 51, NULL, NULL, CURRENT_TIMESTAMP),
  ('REPEATED_ABSENCE', 'REPEATED_ABSENCE', true, 'WARNING', NULL, 3, 7, CURRENT_TIMESTAMP);

ALTER TABLE "audit_logs"
  ADD COLUMN "student_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
CREATE INDEX "audit_logs_student_ids_idx" ON "audit_logs" USING GIN ("student_ids");

UPDATE "audit_logs" audit
SET "student_ids" = ARRAY[student."student_id"]
FROM "grades" student
WHERE audit."entity" = 'Grade' AND audit."entity_id" = student."id";

UPDATE "audit_logs" audit
SET "student_ids" = ARRAY[attendance."student_id"]
FROM "attendances" attendance
WHERE audit."entity" = 'Attendance' AND audit."entity_id" = attendance."id";

UPDATE "audit_logs" audit
SET "student_ids" = ARRAY(
  SELECT DISTINCT grade."student_id"
  FROM "grades" grade
  JOIN "enrollments" enrollment ON enrollment."id" = grade."enrollment_id"
  WHERE enrollment."course_id" = audit."new_value"->>'courseId'
    AND grade."subject_id" = audit."new_value"->>'subjectId'
    AND grade."period_id" = audit."new_value"->>'periodId'
)
WHERE audit."entity" = 'GradeBulk'
  AND audit."new_value"->>'courseId' IS NOT NULL
  AND audit."new_value"->>'subjectId' IS NOT NULL
  AND audit."new_value"->>'periodId' IS NOT NULL;

UPDATE "audit_logs" audit
SET "student_ids" = ARRAY[student."id"]
FROM "students" student
WHERE audit."entity" = 'Student' AND audit."entity_id" = student."id";

UPDATE "audit_logs" audit
SET "student_ids" = ARRAY[student."id"]
FROM "students" student
WHERE audit."entity" = 'StudentAccountActivation'
  AND audit."entity_id" = student."user_id";

UPDATE "audit_logs" audit
SET "student_ids" = ARRAY[student."id"]
FROM "students" student
WHERE audit."entity" = 'UserCredential'
  AND audit."entity_id" = student."user_id";

UPDATE "audit_logs" audit
SET "student_ids" = ARRAY[enrollment."student_id"]
FROM "enrollments" enrollment
WHERE audit."entity" = 'Enrollment'
  AND audit."entity_id" = enrollment."id";

UPDATE "audit_logs" audit
SET "student_ids" = ARRAY[item."student_id"]
FROM "sie_synchronization_items" item
WHERE audit."entity" = 'SieSynchronization'
  AND audit."new_value"->>'itemId' = item."id";

UPDATE "audit_logs" audit
SET "student_ids" = ARRAY[grade."student_id"]
FROM "grade_correction_requests" request
JOIN "grades" grade ON grade."id" = request."grade_id"
WHERE audit."entity" = 'GradeCorrectionRequest' AND audit."entity_id" = request."id";

COMMIT;
