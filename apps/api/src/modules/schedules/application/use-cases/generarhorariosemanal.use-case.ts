import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  errorconflictoaplicacion,
  errornoencontrado,
  errorsolicitudincorrecta,
} from '../../../../core/application/aplicacionerror';
import {
  tokenrepositoriohorarios,
  repositoriohorarios,
  resumengeneracionhorario,
} from '../../domain/repositories/horario.repository.interface';
import {
  errorgeneracionhorario,
  generarhorariosemanal,
} from '../../domain/services/generarhorariosemanal';

@servicioaplicacion()
export class casousogenerarhorariosemanal {
  constructor(
    @inyectarpuerto(tokenrepositoriohorarios) private readonly repositorio: repositoriohorarios,
  ) {}

  async ejecutar(idcurso: string): Promise<resumengeneracionhorario> {
    const datos = await this.repositorio.cargardatosgeneracion(idcurso);
    if (!datos) throw new errornoencontrado('Curso no encontrado');

    let generado;
    try {
      generado = generarhorariosemanal(
        datos.curso.nivel,
        datos.curso.turno,
        datos.asignaciones,
        datos.bloquesOcupados,
      );
    } catch (error) {
      if (!(error instanceof errorgeneracionhorario)) throw error;
      if (
        error.code === 'NO_ASSIGNMENTS' ||
        error.code === 'TOO_MANY_ASSIGNMENTS' ||
        error.code === 'WEEKLY_PERIODS_MISMATCH'
      ) {
        throw new errorsolicitudincorrecta(error.message);
      }
      throw new errorconflictoaplicacion(error.message);
    }

    await this.repositorio.guardarhorariogenerado({
      idCurso: datos.curso.id,
      idGestionAcademica: datos.curso.idGestionAcademica,
      nombreCursoEsperado: datos.curso.nombre,
      nivelEsperado: datos.curso.nivel,
      turnoEsperado: datos.curso.turno,
      aula: `Aula ${datos.curso.nombre}`,
      asignacionesEsperadas: datos.asignaciones.map((asignacion) => ({
        teacherId: asignacion.teacher.id,
        subjectId: asignacion.subject.id,
      })),
      bloques: generado.slots,
    });

    return {
      message: 'Horario semanal generado con una distribución equilibrada para revisión académica.',
      totalSlots: generado.slots.length,
      distribution: generado.distribution.map((elemento) => ({
        subjectName: elemento.subject.name,
        code: elemento.subject.code,
        teacherName: `${elemento.teacher.firstName} ${elemento.teacher.lastName}`,
        periods: elemento.periods,
      })),
    };
  }
}
