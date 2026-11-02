ALTER TYPE "SieSyncStatus" ADD VALUE IF NOT EXISTS 'PAUSED';

CREATE TYPE "SieDiscrepancyGroupStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

ALTER TABLE "sie_synchronizations"
  ADD COLUMN "paused_at" TIMESTAMP(3),
  ADD COLUMN "paused_reason" TEXT;

ALTER TABLE "sie_synchronization_items"
  ADD COLUMN "discrepancy_group_id" TEXT;

CREATE TABLE "sie_discrepancy_groups" (
  "id" TEXT NOT NULL,
  "synchronization_id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "subject_id" TEXT NOT NULL,
  "period_id" TEXT NOT NULL,
  "assigned_to_id" TEXT NOT NULL,
  "status" "SieDiscrepancyGroupStatus" NOT NULL DEFAULT 'OPEN',
  "due_at" TIMESTAMP(3) NOT NULL,
  "resolved_by_id" TEXT,
  "resolved_at" TIMESTAMP(3),
  "resolution_reason" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sie_discrepancy_groups_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sie_discrepancy_groups_synchronization_id_course_id_subject_id_period_id_key"
  ON "sie_discrepancy_groups"("synchronization_id", "course_id", "subject_id", "period_id");
CREATE INDEX "sie_discrepancy_groups_status_due_at_idx"
  ON "sie_discrepancy_groups"("status", "due_at");
CREATE INDEX "sie_discrepancy_groups_assigned_to_id_status_idx"
  ON "sie_discrepancy_groups"("assigned_to_id", "status");
CREATE INDEX "sie_synchronization_items_discrepancy_group_id_idx"
  ON "sie_synchronization_items"("discrepancy_group_id");

ALTER TABLE "sie_discrepancy_groups"
  ADD CONSTRAINT "sie_discrepancy_groups_synchronization_id_fkey"
  FOREIGN KEY ("synchronization_id") REFERENCES "sie_synchronizations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "sie_discrepancy_groups_course_id_fkey"
  FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "sie_discrepancy_groups_subject_id_fkey"
  FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "sie_discrepancy_groups_period_id_fkey"
  FOREIGN KEY ("period_id") REFERENCES "academic_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "sie_discrepancy_groups_assigned_to_id_fkey"
  FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "sie_discrepancy_groups_resolved_by_id_fkey"
  FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "sie_synchronization_items"
  ADD CONSTRAINT "sie_synchronization_items_discrepancy_group_id_fkey"
  FOREIGN KEY ("discrepancy_group_id") REFERENCES "sie_discrepancy_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "sie_discrepancy_groups" (
  "id",
  "synchronization_id",
  "course_id",
  "subject_id",
  "period_id",
  "assigned_to_id",
  "status",
  "due_at",
  "created_at",
  "updated_at"
)
SELECT
  gen_random_uuid()::text,
  item."synchronization_id",
  enrollment."course_id",
  item."subject_id",
  item."period_id",
  synchronization."requested_by_id",
  'OPEN',
  CURRENT_TIMESTAMP + INTERVAL '72 hours',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "sie_synchronization_items" AS item
JOIN "sie_synchronizations" AS synchronization
  ON synchronization."id" = item."synchronization_id"
JOIN "grades" AS grade
  ON grade."student_id" = item."student_id"
 AND grade."subject_id" = item."subject_id"
 AND grade."period_id" = item."period_id"
JOIN "enrollments" AS enrollment
  ON enrollment."id" = grade."enrollment_id"
WHERE item."status" = 'DISCREPANCY'
  AND item."discrepancy_resolved_at" IS NULL
GROUP BY
  item."synchronization_id",
  enrollment."course_id",
  item."subject_id",
  item."period_id",
  synchronization."requested_by_id"
ON CONFLICT ("synchronization_id", "course_id", "subject_id", "period_id") DO NOTHING;

UPDATE "sie_synchronization_items" AS item
SET "discrepancy_group_id" = discrepancy_group."id"
FROM "grades" AS grade,
     "enrollments" AS enrollment,
     "sie_discrepancy_groups" AS discrepancy_group
WHERE item."status" = 'DISCREPANCY'
  AND item."discrepancy_resolved_at" IS NULL
  AND grade."student_id" = item."student_id"
  AND grade."subject_id" = item."subject_id"
  AND grade."period_id" = item."period_id"
  AND enrollment."id" = grade."enrollment_id"
  AND discrepancy_group."synchronization_id" = item."synchronization_id"
  AND discrepancy_group."course_id" = enrollment."course_id"
  AND discrepancy_group."subject_id" = item."subject_id"
  AND discrepancy_group."period_id" = item."period_id";
