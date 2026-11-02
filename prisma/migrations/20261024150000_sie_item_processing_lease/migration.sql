ALTER TABLE "sie_synchronization_items"
  ADD COLUMN "processing_token" TEXT,
  ADD COLUMN "processing_lease_until" TIMESTAMP(3);

UPDATE "sie_synchronization_items"
SET "processing_lease_until" = CURRENT_TIMESTAMP + INTERVAL '5 minutes'
WHERE "status" = 'PROCESSING';

CREATE INDEX "sie_synchronization_items_processing_lease_until_idx"
  ON "sie_synchronization_items"("processing_lease_until");
