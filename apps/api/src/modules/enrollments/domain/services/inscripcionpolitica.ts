import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';

export interface hechosinicioinscripcion {
  studentActive: boolean;
  courseAcademicYearId: string;
  selectedAcademicYearId: string;
  academicYearOpen: boolean;
  alreadyEnrolled: boolean;
  activeEnrollmentCount: number;
  courseCapacity: number;
}

export class politicainscripcion {
  static afirmarpuedeinicio(hechos: hechosinicioinscripcion): void {
    if (!hechos.studentActive) {
      throw new incumplimientoregladominio('NOT_FOUND', 'Estudiante activo no encontrado');
    }
    if (hechos.courseAcademicYearId !== hechos.selectedAcademicYearId) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'El curso no corresponde a la gestión académica seleccionada',
      );
    }
    if (!hechos.academicYearOpen) {
      throw new incumplimientoregladominio('VALIDATION', 'La gestión académica está cerrada');
    }
    if (hechos.alreadyEnrolled) {
      throw new incumplimientoregladominio(
        'CONFLICT',
        'El estudiante ya tiene una matrícula en esta gestión',
      );
    }
    if (hechos.activeEnrollmentCount >= hechos.courseCapacity) {
      throw new incumplimientoregladominio('CONFLICT', 'El curso alcanzó su capacidad máxima');
    }
  }

  static afirmarpuedereactivar(hechos: {
    academicYearOpen: boolean;
    activeEnrollmentCount: number;
    courseCapacity: number;
  }): void {
    if (!hechos.academicYearOpen) {
      throw new incumplimientoregladominio('VALIDATION', 'La gestión académica está cerrada');
    }
    if (hechos.activeEnrollmentCount >= hechos.courseCapacity) {
      throw new incumplimientoregladominio('CONFLICT', 'El curso alcanzó su capacidad máxima');
    }
  }
}
