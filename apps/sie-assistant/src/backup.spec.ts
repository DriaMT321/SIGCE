import {
  buildBackupCsv,
  buildBackupJson,
  createGradeBackupFromPlan,
  deleteGradeBackup,
  is6toSecundaria,
  listGradeBackups,
  restorePlanFromBackup,
  saveGradeBackup,
} from './backup';
import type { GradePlan } from './types';

describe('Copia de Seguridad de Calificaciones (SIE Assistant Backup)', () => {
  const planSenior: GradePlan = {
    course: { id: 'c-6sec', name: '6º de Secundaria A' },
    subject: { id: 's-mat', name: 'Matemática', code: 'MAT' },
    period: { number: 1, name: 'Primer trimestre' },
    fingerprint: 'HASH_6TO_SECUNDARIA_2026',
    grades: [
      {
        gradeId: 'g-1',
        studentId: 'st-1',
        rude: '807300012026',
        firstName: 'Carlos',
        lastName: 'Mamani Flores',
        value: 85,
      },
      {
        gradeId: 'g-2',
        studentId: 'st-2',
        rude: '807300022026',
        firstName: 'Elena',
        lastName: 'Quispe Choque',
        value: 92,
      },
    ],
  };

  const planPrimaria: GradePlan = {
    course: { id: 'c-6pri', name: '6º de Primaria B' },
    subject: { id: 's-len', name: 'Lenguaje', code: 'LEN' },
    period: { number: 1, name: 'Primer trimestre' },
    fingerprint: 'HASH_PRIMARIA_2026',
    grades: [
      {
        gradeId: 'g-p1',
        studentId: 'st-p1',
        rude: '807300992026',
        firstName: 'Mateo',
        lastName: 'Condori',
        value: 70,
      },
    ],
  };

  describe('Detección de 6to de Secundaria (Bachillerato)', () => {
    it('detecta 6to de secundaria en múltiples formatos de nombre', () => {
      expect(is6toSecundaria('6º de Secundaria A')).toBe(true);
      expect(is6toSecundaria('6to de Secundaria B')).toBe(true);
      expect(is6toSecundaria('Secundaria - Sexto A')).toBe(true);
      expect(is6toSecundaria('Secundaria - Sexto U')).toBe(true);
      expect(is6toSecundaria('6° Secundaria')).toBe(true);
      expect(is6toSecundaria('Secundaria 6to A')).toBe(true);
      expect(is6toSecundaria('Bachillerato 6to de Secundaria')).toBe(true);
    });

    it('no confunde 6to de secundaria con 6to de primaria ni con otros cursos', () => {
      expect(is6toSecundaria('6º de Primaria A')).toBe(false);
      expect(is6toSecundaria('6to de Primaria B')).toBe(false);
      expect(is6toSecundaria('1º de Secundaria A')).toBe(false);
      expect(is6toSecundaria('5º de Secundaria B')).toBe(false);
      expect(is6toSecundaria('Primaria - Segundo B')).toBe(false);
      expect(is6toSecundaria('')).toBe(false);
    });
  });

  describe('Generación de Copia de Seguridad', () => {
    it('crea un objeto de respaldo completo con metadatos para 6to de secundaria', () => {
      const backup = createGradeBackupFromPlan(planSenior, 'Lic. Martha Gómez');
      expect(backup.isSeniorYear).toBe(true);
      expect(backup.courseName).toBe('6º de Secundaria A');
      expect(backup.fingerprint).toBe('HASH_6TO_SECUNDARIA_2026');
      expect(backup.totalStudents).toBe(2);
      expect(backup.userResponsible).toBe('Lic. Martha Gómez');
      expect(backup.grades).toHaveLength(2);
      expect(backup.status).toBe('SAVED');
    });

    it('marca isSeniorYear como false para otros cursos como primaria', () => {
      const backup = createGradeBackupFromPlan(planPrimaria);
      expect(backup.isSeniorYear).toBe(false);
      expect(backup.totalStudents).toBe(1);
    });
  });

  describe('Exportación a JSON y CSV', () => {
    it('genera JSON válido con toda la información requerida', () => {
      const backup = createGradeBackupFromPlan(planSenior, 'Responsable SIE');
      const jsonStr = buildBackupJson(backup);
      const parsed = JSON.parse(jsonStr);

      expect(parsed.titulo).toContain('COPIA DE SEGURIDAD');
      expect(parsed.curso.nombre).toBe('6º de Secundaria A');
      expect(parsed.curso.es6toSecundariaBachillerato).toBe(true);
      expect(parsed.huellaIntegridadSIGCE).toBe('HASH_6TO_SECUNDARIA_2026');
      expect(parsed.totalEstudiantes).toBe(2);
      expect(parsed.estudiantesCalificaciones[0].rude).toBe('807300012026');
      expect(parsed.estudiantesCalificaciones[0].calificacion).toBe(85);
      expect(parsed.estudiantesCalificaciones[0].estado).toBe('APROBADO');
    });

    it('genera CSV con BOM UTF-8 y encabezados institucionales para Excel', () => {
      const backup = createGradeBackupFromPlan(planSenior, 'Responsable SIE');
      const csv = buildBackupCsv(backup);

      // Verificamos que inicie con BOM (\uFEFF)
      expect(csv.charCodeAt(0)).toBe(0xfeff);
      expect(csv).toContain('COPIA DE SEGURIDAD DE CALIFICACIONES');
      expect(csv).toContain('6º de Secundaria A');
      expect(csv).toContain('807300012026;"Mamani Flores";"Carlos"');
      expect(csv).toContain('85;Aprobado;HASH_6TO_SECUNDARIA_2026');
    });

    it('permite restaurar fielmente un GradePlan activo desde un respaldo', () => {
      const backup = createGradeBackupFromPlan(planSenior);
      const restored = restorePlanFromBackup(backup);

      expect(restored.course.id).toBe(planSenior.course.id);
      expect(restored.course.name).toBe(planSenior.course.name);
      expect(restored.subject.name).toBe(planSenior.subject.name);
      expect(restored.fingerprint).toBe(planSenior.fingerprint);
      expect(restored.grades).toHaveLength(2);
      expect(restored.grades[0]?.rude).toBe('807300012026');
    });
  });

  describe('Persistencia en chrome.storage.local', () => {
    let mockStorage: Record<string, unknown> = {};

    beforeEach(() => {
      mockStorage = {};
      (global as unknown as { chrome: unknown }).chrome = {
        storage: {
          local: {
            get: jest.fn().mockImplementation((key: string) => {
              return Promise.resolve({ [key]: mockStorage[key] || [] });
            }),
            set: jest.fn().mockImplementation((obj: Record<string, unknown>) => {
              Object.assign(mockStorage, obj);
              return Promise.resolve();
            }),
          },
        },
      };
    });

    it('guarda y lista copias de seguridad correctamente', async () => {
      const backup = createGradeBackupFromPlan(planSenior);
      await saveGradeBackup(backup);

      const list = await listGradeBackups();
      expect(list).toHaveLength(1);
      expect(list[0]?.id).toBe(backup.id);
      expect(list[0]?.courseName).toBe('6º de Secundaria A');
    });

    it('permite eliminar una copia de seguridad específica', async () => {
      const backup1 = createGradeBackupFromPlan(planSenior);
      const backup2 = createGradeBackupFromPlan(planPrimaria);

      await saveGradeBackup(backup1);
      await saveGradeBackup(backup2);

      const remaining = await deleteGradeBackup(backup1.id);
      expect(remaining.some((b) => b.id === backup1.id)).toBe(false);
      expect(remaining.some((b) => b.id === backup2.id)).toBe(true);
    });
  });
});
