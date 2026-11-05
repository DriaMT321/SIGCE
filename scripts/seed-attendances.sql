INSERT INTO attendances (id, student_id, course_id, registered_by_id, date, status, justification, created_at, updated_at)
WITH school_days AS (
  SELECT d::date as day
  FROM generate_series('2026-02-02'::date, '2026-05-29'::date, '1 day'::interval) d
  WHERE EXTRACT(DOW FROM d) BETWEEN 1 AND 5
    AND d::date NOT IN ('2026-02-16', '2026-02-17', '2026-04-03', '2026-05-01')
),
student_courses AS (
  SELECT student_id, course_id
  FROM enrollments
  WHERE status = 'ACTIVE'
)
SELECT 
  gen_random_uuid()::text,
  sc.student_id,
  sc.course_id,
  '11b483b4-2d64-447c-98eb-787fd9767760',
  sd.day,
  (CASE 
    WHEN abs(hashtext(concat(sc.student_id, sd.day))) % 100 < 92 THEN 'PRESENT'::"AttendanceStatus"
    WHEN abs(hashtext(concat(sc.student_id, sd.day))) % 100 < 96 THEN 'LATE'::"AttendanceStatus"
    WHEN abs(hashtext(concat(sc.student_id, sd.day))) % 100 < 98 THEN 'JUSTIFIED'::"AttendanceStatus"
    ELSE 'ABSENT'::"AttendanceStatus"
  END),
  (CASE
    WHEN abs(hashtext(concat(sc.student_id, sd.day))) % 100 = 96 THEN 'Permiso médico / consulta de salud'
    WHEN abs(hashtext(concat(sc.student_id, sd.day))) % 100 = 97 THEN 'Licencia por motivo familiar justificada'
    ELSE NULL
  END),
  sd.day + time '08:00:00',
  sd.day + time '08:00:00'
FROM student_courses sc
CROSS JOIN school_days sd
ON CONFLICT (student_id, course_id, date) DO NOTHING;
