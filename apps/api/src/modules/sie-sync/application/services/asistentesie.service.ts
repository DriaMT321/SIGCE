import {
  errorconflictoaplicacion,
  errornoencontrado,
  errorsolicitudincorrecta,
} from '../../../../core/application/aplicacionerror';
import { inyectarpuerto, servicioaplicacion } from '../../../../core/application/aplicacioninyeccion';
import {
  type actoresumensie,
  type datosresumenasistentesie,
  type datosseleccionasistentesie,
  type registroauditoriaasistentesie,
  type repositorioasistentesie,
  tokenrepositorioasistentesie,
} from '../ports/asistentesie.port';

@servicioaplicacion()
export class servicioasistentesie {
  constructor(
    @inyectarpuerto(tokenrepositorioasistentesie)
    private readonly repositorio: repositorioasistentesie,
  ) {}

  async prepararnotas(filtros: datosseleccionasistentesie) {
    const { course: curso, subject: materia, period: periodo } =
      await this.repositorio.obtenercontexto(filtros);

    if (!curso || !materia || !periodo) {
      throw new errornoencontrado('No se encontró el curso, la materia o el trimestre seleccionado.');
    }
    if (!periodo.isClosed) {
      throw new errorsolicitudincorrecta('El trimestre debe estar cerrado para preparar notas.');
    }

    const calificaciones = await this.repositorio.listarnotaspublicadas(filtros, periodo.id);
    if (
      calificaciones.some(
        (nota) => !Number.isFinite(nota.value) || nota.value < 0 || nota.value > 100,
      )
    ) {
      throw new errorconflictoaplicacion(
        'Hay calificaciones fuera del rango permitido. Corríjalas en SIGCE.',
      );
    }

    const ordenadas = [...calificaciones].sort(
      (a, b) =>
        a.student.lastName.localeCompare(b.student.lastName, 'es') ||
        a.student.firstName.localeCompare(b.student.firstName, 'es') ||
        a.student.rude.localeCompare(b.student.rude),
    );

    const fingerprint = this.repositorio.resumensha256(
      JSON.stringify({
        academicYearId: filtros.academicYearId,
        courseId: curso.id,
        subjectId: materia.id,
        periodNumber: periodo.number,
        grades: ordenadas.map((nota) => ({
          id: nota.id,
          studentId: nota.studentId,
          rude: nota.student.rude,
          lastName: nota.student.lastName,
          value: nota.value,
          updatedAt: nota.updatedAt.toISOString(),
          publishedAt: nota.publishedAt?.toISOString(),
        })),
      }),
    );

    return {
      course: curso,
      subject: materia,
      period: { number: periodo.number, name: periodo.name },
      grades: ordenadas.map((nota) => ({
        gradeId: nota.id,
        studentId: nota.studentId,
        rude: nota.student.rude,
        firstName: nota.student.firstName,
        lastName: nota.student.lastName,
        value: nota.value,
      })),
      fingerprint,
    };
  }

  async registrarresumen(entrada: datosresumenasistentesie, actor: actoresumensie) {
    const reportado = {
      event: 'ASSISTED_UI_ENTRY_REPORTED',
      academicYearId: entrada.academicYearId,
      courseId: entrada.courseId,
      subjectId: entrada.subjectId,
      periodNumber: entrada.periodNumber,
      fingerprint: entrada.fingerprint,
      entries: entrada.entries.map((item) => ({
        gradeId: item.gradeId,
        result: item.result,
        ...(item.reason?.trim() ? { reason: item.reason.trim() } : {}),
      })),
    };
    const payloadHash = this.repositorio.resumensha256(
      JSON.stringify({ userId: actor.userId, reportado }),
    );

    const previous = await this.repositorio.buscarauditoria(entrada.operationId);
    if (previous) {
      return this.reusarresumenidempotente(
        previous,
        actor.userId,
        payloadHash,
        entrada.entries.length,
      );
    }

    const preparado = await this.prepararnotas(entrada);
    if (preparado.fingerprint !== entrada.fingerprint) {
      throw new errorconflictoaplicacion('Las notas cambiaron en SIGCE. Vuelva a preparar el curso.');
    }

    const notas = new Map(preparado.grades.map((nota) => [nota.gradeId, nota]));
    const ids = new Set<string>();
    for (const entradaresultado of entrada.entries) {
      if (ids.has(entradaresultado.gradeId) || !notas.has(entradaresultado.gradeId)) {
        throw new errorsolicitudincorrecta(
          'El resumen contiene una nota duplicada o fuera de la selección.',
        );
      }
      ids.add(entradaresultado.gradeId);
      if (
        entradaresultado.result !== 'FILLED' &&
        entradaresultado.result !== 'CONFIRMED_BY_USER' &&
        !entradaresultado.reason?.trim()
      ) {
        throw new errorsolicitudincorrecta('Los registros omitidos o con error requieren un motivo.');
      }
    }

    let auditoria: { id: string; createdAt: Date };
    try {
      auditoria = await this.repositorio.crearauditoria({
        operationId: entrada.operationId,
        userId: actor.userId,
        courseId: entrada.courseId,
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
        correlationId: actor.correlationId,
        studentIds: [
          ...new Set(entrada.entries.map((item) => notas.get(item.gradeId)!.studentId)),
        ],
        newValue: { ...reportado, operationId: entrada.operationId, payloadHash },
        reason:
          'Registro de acciones informadas por la extensión; no acredita persistencia ni verificación en el SIE.',
      });
    } catch (error) {
      const raced = await this.repositorio.buscarauditoria(entrada.operationId);
      if (!raced) throw error;
      return this.reusarresumenidempotente(
        raced,
        actor.userId,
        payloadHash,
        entrada.entries.length,
      );
    }

    return {
      auditId: auditoria.id,
      recordedAt: auditoria.createdAt.toISOString(),
      recordedEntries: entrada.entries.length,
      verification: 'USER_REPORTED',
    };
  }

  private reusarresumenidempotente(
    existente: registroauditoriaasistentesie,
    userId: string,
    payloadHash: string,
    recordedEntries: number,
  ) {
    const dato = existente.newValue;
    const hashGuardado =
      dato && typeof dato === 'object' && !Array.isArray(dato) && 'payloadHash' in dato
        ? dato.payloadHash
        : undefined;
    if (
      existente.userId !== userId ||
      existente.entity !== 'SieAssistedEntrySummary' ||
      hashGuardado !== payloadHash
    ) {
      throw new errorconflictoaplicacion(
        'El identificador de operación ya fue utilizado con otros datos.',
      );
    }
    return {
      auditId: existente.id,
      recordedAt: existente.createdAt.toISOString(),
      recordedEntries,
      verification: 'USER_REPORTED',
    };
  }
}
