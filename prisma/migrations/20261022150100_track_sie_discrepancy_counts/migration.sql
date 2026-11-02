ALTER TABLE "sie_synchronizations"
ADD COLUMN "discrepancy_count" INTEGER NOT NULL DEFAULT 0;

UPDATE "sie_synchronization_items"
SET
  "status" = 'DISCREPANCY',
  "verified_at" = COALESCE("verified_at", "updated_at")
WHERE "status" = 'FAILED'
  AND "sie_value" IS NOT NULL
  AND "error_message" ILIKE '%difiere%';

UPDATE "sie_synchronizations" AS synchronization
SET
  "discrepancy_count" = (
    SELECT COUNT(*)
    FROM "sie_synchronization_items" AS item
    WHERE item."synchronization_id" = synchronization."id"
      AND item."status" = 'DISCREPANCY'
  ),
  "error_count" = (
    SELECT COUNT(*)
    FROM "sie_synchronization_items" AS item
    WHERE item."synchronization_id" = synchronization."id"
      AND item."status" = 'FAILED'
  );

UPDATE "sie_synchronizations"
SET "status" = 'DISCREPANCY'
WHERE "status" = 'FAILED'
  AND "processed_items" >= "total_items"
  AND "error_count" = 0
  AND "discrepancy_count" > 0;
