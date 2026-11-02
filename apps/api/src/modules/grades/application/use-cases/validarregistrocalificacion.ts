import {
  errorsolicitudincorrecta,
  errorprohibido,
  errornoencontrado,
} from '../../../../core/application/aplicacionerror';
import { rolusuario } from '@academic/domain-kernel';
import { repositoriocalificaciones } from '../../domain/repositories/calificacion.repository.interface';

interface objetivocalificacion {
  enrollmentId: string;
  studentId: string;
}

interface escrituracalificacion {
  courseId?: string;
  subjectId: string;
  periodId: string;
  grades: objetivocalificacion[];
  reason?: string;
}

export async function validarescrituracalificacion(
  repositorio: repositoriocalificaciones,
  entrada: escrituracalificacion,
  idusuario: string,
  rolactual: rolusuario,
): Promise<void> {
  if (entrada.grades.length === 0) {
    throw new errorsolicitudincorrecta('Debe incluir al menos una calificación');
  }
  const inscripcionids = entrada.grades.map((calificacion) => calificacion.enrollmentId);
  const idsestudiantes = entrada.grades.map((calificacion) => calificacion.studentId);
  if (
    new Set(inscripcionids).size !== inscripcionids.length ||
    new Set(idsestudiantes).size !== idsestudiantes.length
  ) {
    throw new errorsolicitudincorrecta('La carga contiene matrículas o estudiantes repetidos');
  }

  const contexto = await repositorio.obtenercontextoescritura({
    periodId: entrada.periodId,
    subjectId: entrada.subjectId,
    enrollmentIds: inscripcionids,
    courseId: entrada.courseId,
    ...(rolactual === rolusuario.TEACHER ? { teacherUserId: idusuario } : {}),
  });
  if (!contexto.period || !contexto.subjectExists) {
    throw new errornoencontrado('Período o materia no encontrados');
  }
  if (contexto.enrollments.length !== entrada.grades.length) {
    throw new errornoencontrado('Una o más matrículas no existen');
  }
  const inscripcionporid = new Map(
    contexto.enrollments.map((inscripcion) => [inscripcion.id, inscripcion]),
  );
  for (const calificacion of entrada.grades) {
    const inscripcion = inscripcionporid.get(calificacion.enrollmentId);
    if (
      !inscripcion ||
      inscripcion.studentId !== calificacion.studentId ||
      inscripcion.academicYearId !== contexto.period.academicYearId ||
      inscripcion.status !== 'ACTIVE' ||
      (entrada.courseId && inscripcion.courseId !== entrada.courseId)
    ) {
      throw new errorsolicitudincorrecta(
        'La calificación no corresponde a una matrícula activa del curso y período indicados',
      );
    }
  }

  if (contexto.period.isClosed) {
    throw new errorprohibido(
      'El período está cerrado. Registre una solicitud formal de corrección para su aprobación.',
    );
  }

  if (rolactual === rolusuario.TEACHER) {
    if (!contexto.teacherProfileExists) {
      throw new errorprohibido('El usuario no tiene un perfil docente asociado');
    }
    if (!contexto.hasAssignment) {
      throw new errorprohibido(
        'El docente no tiene asignación académica para esta materia y curso',
      );
    }
  }
}
