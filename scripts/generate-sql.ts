import * as fs from 'node:fs';
import * as path from 'node:path';

const profsPath = path.resolve(__dirname, '../profesores_extraidos.json');
const studsPath = path.resolve(__dirname, '../estudiantes_extraidos.json');

const profs = JSON.parse(fs.readFileSync(profsPath, 'utf-8'));
const studs = JSON.parse(fs.readFileSync(studsPath, 'utf-8'));

const KNOWN_FEMALE_FIRST_NAMES = new Set([
  'ANALIA', 'ANALY', 'BELEN', 'CARMEN', 'CRISTAL', 'ESTHER', 'GISSEL', 'GRISEL',
  'HEIDY', 'ITZEL', 'KAREN', 'LESLIE', 'LIZBETH', 'MARIBEL', 'MERCEDES', 'MIRIAM',
  'NOEMI', 'PILAR', 'RAQUEL', 'ROSARIO', 'RUTH', 'SHIRLEY', 'YOSELIN', 'YASMIN',
  'ABIGAIL', 'AILIN', 'NAZARETH', 'AYELEN', 'BETZABE', 'SARAHI', 'YOMARA', 'NAYELI'
]);

function inferGender(fullName: string): 'FEMALE' | 'MALE' {
  const firstName = (fullName || '').trim().split(' ')[0].toUpperCase();
  if (KNOWN_FEMALE_FIRST_NAMES.has(firstName) || firstName.endsWith('A')) {
    return 'FEMALE';
  }
  return 'MALE';
}

function parseCourseMeta(courseName: string) {
  const parts = courseName.split('-');
  const level = parts[0].trim();
  const rest = parts[1].trim();
  const match = rest.match(/^(Primero|Segundo|Tercero|Cuarto|Quinto|Sexto)\s+([A-Z])$/i);
  if (!match) throw new Error(`Formato no reconocido: ${courseName}`);
  const gradeName = match[1].toLowerCase();
  const section = match[2].toUpperCase();
  const mapPrimSec: Record<string, number> = { primero: 1, segundo: 2, tercero: 3, cuarto: 4, quinto: 5, sexto: 6 };
  let gradeLevel = 1;
  if (level.includes('Inicial')) gradeLevel = gradeName === 'primero' ? 1 : 2;
  else if (level.includes('Primaria')) gradeLevel = 2 + mapPrimSec[gradeName];
  else if (level.includes('Secundaria')) gradeLevel = 8 + mapPrimSec[gradeName];
  return { name: courseName.trim(), gradeLevel, section, shift: 'MORNING', maxCapacity: 45 };
}

function parseBirthDate(dateStr: string): string {
  const parts = (dateStr || '').trim().split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return '2015-01-01';
}

function escapeSql(str: string): string {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

let sql = `-- ==============================================================================
-- SCRIPT SQL DE INYECCIÓN DE DATOS EXTRAÍDOS (SIGCE / SIE 2026)
-- Cursos (30), Docentes (34), Estudiantes (874) y Matrículas (874)
-- ==============================================================================

BEGIN;

DO $$
DECLARE
    v_year_id UUID;
    v_user_id UUID;
    v_course_id UUID;
    v_student_id UUID;
    v_pass_hash TEXT := '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/bB8F1K1x7aZ6iT8w6hW1v8C1mQ1G'; -- Docente2026!
BEGIN
    SELECT id INTO v_year_id FROM academic_years WHERE year = 2026 LIMIT 1;
    IF v_year_id IS NULL THEN
        RAISE EXCEPTION 'Gestión Académica 2026 no encontrada. Ejecute primero db:setup';
    END IF;

    -- 1. Cursos
`;

for (let i = 1; i < studs.length; i++) {
  const meta = parseCourseMeta(studs[i].curso);
  sql += `    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, '${escapeSql(meta.name)}', ${meta.gradeLevel}, '${meta.section}', 'MORNING', ${meta.maxCapacity}, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;\n`;
}

sql += '\n    -- 2. Docentes y Usuarios\n';
const teacherRows = profs[0]?.datos?.slice(1) || [];
for (const row of teacherRows) {
  const itemNo = (row[0] || '').trim();
  const ci = (row[1] || '').trim();
  const paterno = (row[2] || '').trim();
  const materno = (row[3] || '').trim();
  const nombres = (row[4] || '').trim();
  const cargo = (row[5] || 'MAESTRA/O').trim();
  if (!ci || !nombres) continue;
  const lastName = [paterno, materno].filter(Boolean).join(' ') || 'SIN APELLIDO';
  const email = `docente.${ci}@sigce.edu.bo`.toLowerCase();

  sql += `
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '${escapeSql(email)}', v_pass_hash, '${escapeSql(nombres)}', '${escapeSql(lastName)}', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '${escapeSql(ci)}', '${escapeSql(nombres)}', '${escapeSql(lastName)}', '${escapeSql(cargo)}', '${escapeSql(itemNo)}', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;\n`;
}

sql += '\n    -- 3. Estudiantes y Matrículas\n';
for (let i = 1; i < studs.length; i++) {
  const meta = parseCourseMeta(studs[i].curso);
  sql += `\n    -- Curso: ${escapeSql(meta.name)}\n`;
  sql += `    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = ${meta.gradeLevel} AND section = '${meta.section}' AND shift = 'MORNING' LIMIT 1;\n`;

  const sRows = studs[i].datos.slice(1);
  for (const s of sRows) {
    const rude = (s[1] || '').trim();
    let ci = (s[2] || '').trim();
    const paterno = (s[3] || '').trim();
    const materno = (s[4] || '').trim();
    const nombres = (s[5] || '').trim();
    const fechaNac = parseBirthDate(s[6]);
    if (!rude) continue;
    if (!ci) ci = 'S/CI-' + rude;
    const lastName = [paterno, materno].filter(Boolean).join(' ') || 'SIN APELLIDO';
    const gender = inferGender(nombres);

    sql += `    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '${escapeSql(rude)}', '${escapeSql(ci)}', '${escapeSql(nombres)}', '${escapeSql(lastName)}', '${fechaNac}', '${gender}', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, 'ACTIVE', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;\n`;
  }
}

sql += '\nEND $$;\n\nCOMMIT;\n';

const outPath = path.resolve(__dirname, 'seed-extracted-data.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log('Archivo SQL generado con éxito en:', outPath);
console.log('Tamaño del archivo:', (fs.statSync(outPath).size / 1024).toFixed(2), 'KB');
