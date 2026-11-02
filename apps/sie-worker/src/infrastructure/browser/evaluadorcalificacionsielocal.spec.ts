import { estadosincronizacionsie } from '@academic/domain-kernel';
import { trabajoprocesamientosie } from '../../application/modelos/sincronizacion.model';
import { calificacionessielocales, calificacionesielocal } from './registrossielocal.fixture';
import { evaluarcalificacionsielocal, filasielocal } from './evaluadorcalificacionsielocal';

const trabajo: trabajoprocesamientosie = {
  synchronizationId: 'sync-test',
  itemId: 'item-test',
  studentRude: 'SIM-2026-001',
  academicYear: 2026,
  periodNumber: 1,
  subjectCode: 'MAT-SEC',
  localGrade: 85,
};

function filas(registros: ReadonlyArray<calificacionesielocal>): filasielocal[] {
  return registros.map((registro) => ({
    rudeestudiante: registro.rudeestudiante,
    gestionacademica: String(registro.gestionacademica),
    numeroperiodo: String(registro.numeroperiodo),
    codigoasignatura: registro.codigoasignatura,
    calificacion: String(registro.calificacion),
  }));
}

describe('Evaluador de notas SIE con registros locales sintéticos', () => {
  it('verifica una nota solo cuando coincide con el registro independiente', () => {
    expect(evaluarcalificacionsielocal(trabajo, filas(calificacionessielocales))).toMatchObject({
      status: estadosincronizacionsie.VERIFIED,
      source: 'LOCAL_SIE_SIMULATION',
      sieValue: 85,
      isMatched: true,
    });
  });

  it('detecta una discrepancia y conserva la nota leída', () => {
    const resultado = evaluarcalificacionsielocal(
      { ...trabajo, localGrade: 84 },
      filas(calificacionessielocales),
    );
    expect(resultado).toMatchObject({
      status: estadosincronizacionsie.DISCREPANCY,
      source: 'LOCAL_SIE_SIMULATION',
      localValue: 84,
      sieValue: 85,
      isMatched: false,
    });
    expect(resultado.errorMessage).toContain('difiere');
    expect(resultado.verifiedAt).toBeTruthy();
  });

  it('no inventa una calificación cuando falta el registro exacto', () => {
    const resultado = evaluarcalificacionsielocal(
      { ...trabajo, periodNumber: 2 },
      filas(calificacionessielocales),
    );
    expect(resultado).toMatchObject({
      status: estadosincronizacionsie.FAILED,
      sieValue: null,
      isMatched: false,
    });
    expect(resultado.errorMessage).toContain('No se encontró');
  });

  it('rechaza una calificación no numérica', () => {
    const registroInvalido: calificacionesielocal = {
      rudeestudiante: trabajo.studentRude,
      gestionacademica: trabajo.academicYear,
      numeroperiodo: trabajo.periodNumber,
      codigoasignatura: trabajo.subjectCode,
      calificacion: Number.NaN,
    };
    const resultado = evaluarcalificacionsielocal(trabajo, filas([registroInvalido]));
    expect(resultado).toMatchObject({ status: estadosincronizacionsie.FAILED, sieValue: null });
    expect(resultado.errorMessage).toContain('no es válida');
  });

  it('rechaza registros duplicados para el mismo alumno, gestión, periodo y materia', () => {
    const registro: calificacionesielocal = {
      rudeestudiante: trabajo.studentRude,
      gestionacademica: trabajo.academicYear,
      numeroperiodo: trabajo.periodNumber,
      codigoasignatura: trabajo.subjectCode,
      calificacion: 85,
    };
    const resultado = evaluarcalificacionsielocal(trabajo, filas([registro, registro]));
    expect(resultado).toMatchObject({ status: estadosincronizacionsie.FAILED, sieValue: null });
    expect(resultado.errorMessage).toContain('duplicados');
  });
});
