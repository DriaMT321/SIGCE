ALTER TYPE "UserRole" ADD VALUE 'STUDENT';

ALTER TABLE "users"
ADD COLUMN "password_setup_token_hash" TEXT,
ADD COLUMN "password_setup_expires_at" TIMESTAMP(3),
ADD COLUMN "password_setup_required" BOOLEAN NOT NULL DEFAULT false;
