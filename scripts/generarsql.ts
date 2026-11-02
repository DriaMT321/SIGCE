import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { randomUUID } from 'node:crypto';
import {
  generarcorreodocentedemo,
  generarhashcontrasenaaleatoria,
  obtenerestadoimportado,
  obtenergeneroimportado,
  parsearfechanacimiento,
} from './datosimportacion';
import { guardararchivoprivado, resolverdirectorioprivado } from './rutaseguradirectorioprivado';

const rutaprofesores = path.resolve(__dirname, '../profesores_extraidos.json');
const rutaestudiantes = path.resolve(__dirname, '../estudiantes_extraidos.json');

const profesores = JSON.parse(fs.readFileSync(rutaprofesores, 'utf-8'));
const estudiantes = JSON.parse(fs.readFileSync(rutaestudiantes, 'utf-8'));

function parsearmetadatacurso(nombrecurso: string) {
  const partes = nombrecurso.split('-');
  const nivel = partes[0].trim();
  const resto = partes[1]?.trim();
  const coincidencia = resto?.match(/^(Primero|Segundo|Tercero|Cuarto|Quinto|Sexto)\s+([A-Z])$/i);
  if (!coincidencia) throw new Error(`Formato de curso no reconocido: ${nombrecurso}`);
  const nombregrado = coincidencia[1].toLowerCase();
  const paralelo = coincidencia[2].toUpperCase();
  const nivelesprimariasecundaria: Record<string, number> = {
    primero: 1,
    segundo: 2,
    tercero: 3,
    cuarto: 4,
    quinto: 5,
    sexto: 6,
  };
  let nivelgrado = 1;
  if (nivel.includes('Inicial')) nivelgrado = nombregrado === 'primero' ? 1 : 2;
  else if (nivel.includes('Primaria')) nivelgrado = 2 + nivelesprimariasecundaria[nombregrado];
  else if (nivel.includes('Secundaria')) nivelgrado = 8 + nivelesprimariasecundaria[nombregrado];
  return {
    nombre: nombrecurso.trim(),
    nivelgrado,
    paralelo,
    turno: 'MORNING',
    cupomaximo: 45,
  };
}

function escaparsql(texto: string): string {
  if (!texto) return '';
  return texto.replace(/'/g, "''");
}

let sentenciasql = `-- ==============================================================================
-- SCRIPT SQL DE INYECCIÓN DE DATOS EXTRAÍDOS (SIGCE / SIE 2026)
-- Cursos (30), Docentes (34), Estudiantes (874) y Matrículas (874)
-- Las cuentas docentes reciben hashes aleatorios; un administrador debe asignar sus claves.
-- ==============================================================================

BEGIN;

DO $$
DECLARE
    v_year_id UUID;
    v_user_id UUID;
    v_course_id UUID;
    v_student_id UUID;
BEGIN
    SELECT id INTO v_year_id FROM academic_years WHERE year = 2026 LIMIT 1;
    IF v_year_id IS NULL THEN
        RAISE EXCEPTION 'Gestión Académica 2026 no encontrada. Ejecute primero db:setup';
    END IF;

    -- 1. Cursos
`;

for (let indice = 1; indice < estudiantes.length; indice++) {
  const metacurso = parsearmetadatacurso(estudiantes[indice].curso);
  sentenciasql += `    INSERT INTO courses (id, academic_year_id, name, grade_level, section, shift, max_capacity, created_at, updated_at)
    VALUES (gen_random_uuid(), v_year_id, '${escaparsql(metacurso.nombre)}', ${metacurso.nivelgrado}, '${metacurso.paralelo}', 'MORNING', ${metacurso.cupomaximo}, NOW(), NOW())
    ON CONFLICT (academic_year_id, grade_level, section, shift) DO UPDATE
    SET name = EXCLUDED.name, max_capacity = EXCLUDED.max_capacity;\n`;
}

sentenciasql += '\n    -- 2. Docentes y Usuarios\n';
const filasdocentes = profesores[0]?.datos?.slice(1) || [];
for (const fila of filasdocentes) {
  const numerounidad = (fila[0] || '').trim();
  const cedula = (fila[1] || '').trim();
  const apellidopaterno = (fila[2] || '').trim();
  const apellidomaterno = (fila[3] || '').trim();
  const nombres = (fila[4] || '').trim();
  const cargo = (fila[5] || 'MAESTRA/O').trim();
  if (!cedula || !nombres) continue;
  const apellidos = [apellidopaterno, apellidomaterno].filter(Boolean).join(' ') || 'SIN APELLIDO';
  const correo = generarcorreodocentedemo(nombres, apellidos, cedula);
  const hashcontrasena = generarhashcontrasenaaleatoria();

  sentenciasql += `
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '${escaparsql(correo)}', '${hashcontrasena}', '${escaparsql(nombres)}', '${escaparsql(apellidos)}', 'TEACHER', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING id INTO v_user_id;

    INSERT INTO teachers (id, user_id, ci, first_name, last_name, specialty, item_number, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, '${escaparsql(cedula)}', '${escaparsql(nombres)}', '${escaparsql(apellidos)}', '${escaparsql(cargo)}', '${escaparsql(numerounidad)}', NOW(), NOW())
    ON CONFLICT (ci) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, specialty = EXCLUDED.specialty, item_number = EXCLUDED.item_number;\n`;
}

sentenciasql += '\n    -- 3. Estudiantes y Matrículas\n';
for (let indice = 1; indice < estudiantes.length; indice++) {
  const curso = estudiantes[indice];
  const metacurso = parsearmetadatacurso(curso.curso);
  const encabezados = curso.datos[0] ?? [];
  sentenciasql += `\n    -- Curso: ${escaparsql(metacurso.nombre)}\n`;
  sentenciasql += `    SELECT id INTO v_course_id FROM courses WHERE academic_year_id = v_year_id AND grade_level = ${metacurso.nivelgrado} AND section = '${metacurso.paralelo}' AND shift = 'MORNING' LIMIT 1;\n`;

  const filasestudiantes = curso.datos.slice(1);
  for (const fila of filasestudiantes) {
    const rude = (fila[1] || '').trim();
    let cedula = (fila[2] || '').trim();
    const apellidopaterno = (fila[3] || '').trim();
    const apellidomaterno = (fila[4] || '').trim();
    const nombres = (fila[5] || '').trim();
    if (!rude) continue;
    if (!cedula) cedula = 'S/CI-' + rude;
    const apellidos =
      [apellidopaterno, apellidomaterno].filter(Boolean).join(' ') || 'SIN APELLIDO';
    const fechanacimiento = parsearfechanacimiento(fila[6]).toISOString().slice(0, 10);
    const genero = obtenergeneroimportado(encabezados, fila);
    const estadoinscripcion = obtenerestadoimportado(encabezados, fila);

    sentenciasql += `    INSERT INTO students (id, rude, ci, first_name, last_name, birth_date, gender, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), '${escaparsql(rude)}', '${escaparsql(cedula)}', '${escaparsql(nombres)}', '${escaparsql(apellidos)}', DATE '${fechanacimiento}', '${genero}', true, NOW(), NOW())
    ON CONFLICT (rude) DO UPDATE SET ci = EXCLUDED.ci, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, birth_date = EXCLUDED.birth_date, gender = EXCLUDED.gender
    RETURNING id INTO v_student_id;

    INSERT INTO enrollments (id, student_id, course_id, academic_year_id, status, enrollment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), v_student_id, v_course_id, v_year_id, '${estadoinscripcion}', NOW(), NOW(), NOW())
    ON CONFLICT (student_id, academic_year_id) DO UPDATE SET course_id = EXCLUDED.course_id, status = EXCLUDED.status;\n`;
  }
}

sentenciasql += '\nEND $$;\n\nCOMMIT;\n';

const directorioprivado = resolverdirectorioprivado(
  path.resolve(__dirname, '..'),
  undefined,
  path.join(os.homedir(), '.sigce', 'datos-importados'),
);
const marca = new Date().toISOString().replace(/[:.]/g, '-');
const nombrearchivo = `sembrardatosextraidos_${marca}_${randomUUID()}.sql`;
const rutaprivada = guardararchivoprivado(directorioprivado, nombrearchivo, sentenciasql);
console.log('Archivo SQL generado con éxito en:', rutaprivada);
console.log('Tamaño del archivo:', (fs.statSync(rutaprivada).size / 1024).toFixed(2), 'KB');
