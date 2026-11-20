-- AlterTable
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "rda_number" TEXT;
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "escalafon_category" TEXT;
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "years_of_service" INTEGER;
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "photo_url" TEXT;
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "documents" JSONB;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "teachers_rda_number_idx" ON "teachers"("rda_number");
