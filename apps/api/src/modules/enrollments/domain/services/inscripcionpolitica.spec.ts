import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { hechosinicioinscripcion, politicainscripcion } from './inscripcionpolitica';

const cupodisponible: hechosinicioinscripcion = {
  studentActive: true,
  courseAcademicYearId: 'year-2026',
  selectedAcademicYearId: 'year-2026',
  academicYearOpen: true,
  alreadyEnrolled: false,
  activeEnrollmentCount: 19,
  courseCapacity: 20,
};

describe('enrollment policy', () => {
  it('accepts enrollment when all academic and capacity rules pass', () => {
    expect(() => politicainscripcion.afirmarpuedeinicio(cupodisponible)).not.toThrow();
  });

  it('preventos duplicate enrollment in the same academic year', () => {
    expect(() =>
      politicainscripcion.afirmarpuedeinicio({ ...cupodisponible, alreadyEnrolled: true }),
    ).toThrow(incumplimientoregladominio);
  });

  it('preventos enrollment beyond course capacity', () => {
    expect(() =>
      politicainscripcion.afirmarpuedeinicio({ ...cupodisponible, activeEnrollmentCount: 20 }),
    ).toThrow('El curso alcanzó su capacidad máxima');
  });

  it('preventos reactivation in a closed academic year', () => {
    expect(() =>
      politicainscripcion.afirmarpuedereactivar({
        academicYearOpen: false,
        activeEnrollmentCount: 0,
        courseCapacity: 20,
      }),
    ).toThrow('La gestión académica está cerrada');
  });
});
