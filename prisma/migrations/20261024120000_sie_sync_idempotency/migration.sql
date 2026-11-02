ALTER TABLE "sie_synchronizations"
ADD COLUMN "idempotency_key" TEXT;

CREATE UNIQUE INDEX "sie_synchronizations_idempotency_key_key"
ON "sie_synchronizations"("idempotency_key");
