CREATE INDEX "class_schedules_teacher_slot_lookup_idx"
    ON "class_schedules"("teacher_id", "academic_year_id", "day_of_week", "period_index");

CREATE OR REPLACE FUNCTION "prevent_teacher_schedule_slot_conflict"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM pg_advisory_xact_lock(
        hashtext(NEW."teacher_id"),
        hashtext(
            NEW."academic_year_id" || ':' ||
            NEW."day_of_week"::text || ':' ||
            NEW."period_index"::text
        )
    );

    IF EXISTS (
        SELECT 1
        FROM "class_schedules" AS existente
        WHERE existente."teacher_id" = NEW."teacher_id"
          AND existente."academic_year_id" = NEW."academic_year_id"
          AND existente."day_of_week" = NEW."day_of_week"
          AND existente."period_index" = NEW."period_index"
          AND existente."id" IS DISTINCT FROM NEW."id"
    ) THEN
        RAISE EXCEPTION 'El docente ya tiene una sesión en ese bloque horario.'
            USING ERRCODE = '23505',
                  CONSTRAINT = 'class_schedules_teacher_slot_unique';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER "class_schedules_teacher_slot_guard"
BEFORE INSERT OR UPDATE OF "teacher_id", "academic_year_id", "day_of_week", "period_index"
ON "class_schedules"
FOR EACH ROW
EXECUTE FUNCTION "prevent_teacher_schedule_slot_conflict"();
