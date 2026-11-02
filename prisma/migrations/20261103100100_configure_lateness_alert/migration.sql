INSERT INTO "alert_rules" (
  "id", "key", "enabled", "severity", "grade_threshold",
  "absence_threshold", "absence_window_days", "updated_at"
) VALUES ('REPEATED_LATENESS', 'REPEATED_LATENESS', false, 'WARNING', NULL, 3, 7, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

UPDATE "alerts"
SET "deduplication_key" = 'REPEATED_ABSENCE:' || "student_id" || ':' || substring("deduplication_key" FROM length('REPEATED_ABSENCE:') + 1)
WHERE "rule_key" = 'REPEATED_ABSENCE' AND "student_id" IS NOT NULL
  AND "deduplication_key" LIKE 'REPEATED_ABSENCE:%'
  AND left("deduplication_key", length('REPEATED_ABSENCE:' || "student_id" || ':')) <> 'REPEATED_ABSENCE:' || "student_id" || ':';
