CREATE TABLE "alert_evaluation_outbox" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "available_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_at" TIMESTAMP(3),
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_evaluation_outbox_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "alert_evaluation_outbox_available_at_locked_at_idx"
    ON "alert_evaluation_outbox"("available_at", "locked_at");

ALTER TABLE "alert_evaluation_outbox"
    ADD CONSTRAINT "alert_evaluation_outbox_student_id_fkey"
    FOREIGN KEY ("student_id") REFERENCES "students"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
