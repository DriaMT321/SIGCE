import { servicioaplicacion, inyectarpuerto } from '../../../core/application/aplicacioninyeccion';
import {
  errorsolicitudincorrecta,
  errornoencontrado,
} from '../../../core/application/aplicacionerror';
import { obtenierniveleducativoregular } from '@academic/academic-domain';
import { estadoplanestudio, rolusuario } from '@academic/domain-kernel';
import { actorusuario } from '../../../core/application/actorusuario';
import {
  tokenrepositoriocurriculo,
  repositoriocurriculo,
  datoscreaciontemacurricular,
  filtrostemascurriculares,
} from '../domain/repositories/curriculo.repository.interface';

export interface entradaactualizacionavancecurricular {
  status?: estadoplanestudio;
  progressPercent?: number;
}

@servicioaplicacion()
export class serviciocurriculo {
  constructor(
    @inyectarpuerto(tokenrepositoriocurriculo) private readonly repositorio: repositoriocurriculo,
  ) {}

  async listar(filtros: filtrostemascurriculares, usuario?: actorusuario) {
    const idanioacademico =
      filtros.academicYearId ?? (await this.repositorio.buscaridanioacademicoactivo()) ?? undefined;
    return this.repositorio.buscartemas({
      ...filtros,
      academicYearId: idanioacademico,
      ...(usuario?.role === rolusuario.TEACHER ? { teacherUserId: usuario.id } : {}),
    });
  }

  async obtenerestadisticas(idgestionsolicitada?: string, usuario?: actorusuario) {
    const idanioacademico =
      idgestionsolicitada ?? (await this.repositorio.buscaridanioacademicoactivo()) ?? undefined;
    const temas = await this.repositorio.buscartemas({
      academicYearId: idanioacademico,
      ...(usuario?.role === rolusuario.TEACHER ? { teacherUserId: usuario.id } : {}),
    });
    const totaltemas = temas.length;
    const completado = temas.filter((tema) => tema.status === estadoplanestudio.COMPLETADO).length;
    const enavance = temas.filter((tema) => tema.status === estadoplanestudio.EN_DESARROLLO).length;
    const planificado = temas.filter(
      (tema) => tema.status === estadoplanestudio.PLANIFICADO,
    ).length;
    const inicial = temas.filter(
      (tema) => obtenierniveleducativoregular(tema.gradeLevel) === 'INITIAL',
    );
    const principal = temas.filter(
      (tema) => obtenierniveleducativoregular(tema.gradeLevel) === 'PRIMARY',
    );
    const secundario = temas.filter(
      (tema) => obtenierniveleducativoregular(tema.gradeLevel) === 'SECONDARY',
    );

    return {
      totalTopics: totaltemas,
      completed: completado,
      inProgress: enavance,
      planned: planificado,
      averageProgress: progresopromedio(temas),
      byLevel: {
        inicial: estadisticasnivel(inicial),
        primaria: estadisticasnivel(principal),
        secundaria: estadisticasnivel(secundario),
      },
    };
  }

  async actualizarprogreso(
    id: string,
    datos: entradaactualizacionavancecurricular,
    usuario?: actorusuario,
  ) {
    const actualizado =
      usuario?.role === rolusuario.TEACHER
        ? await this.repositorio.actualizarprogresodocente(id, datos, usuario.id)
        : await this.repositorio.actualizarprogreso(id, datos);
    if (!actualizado) throw new errornoencontrado('Tema curricular no encontrado');
    return actualizado;
  }

  async crear(
    datos: Omit<datoscreaciontemacurricular, 'academicYearId' | 'gradeLevel' | 'campo'> & {
      academicYearId?: string;
      gradeLevel?: number;
      campo?: string;
    },
  ) {
    const idanioacademico =
      datos.academicYearId ?? (await this.repositorio.buscaridanioacademicoactivo());
    if (!idanioacademico) throw new errornoencontrado('No hay una gestión académica activa');
    const nivelacademico = datos.gradeLevel ?? 1;
    if (!obtenierniveleducativoregular(nivelacademico)) {
      throw new errorsolicitudincorrecta('El grado debe estar entre 1º Inicial y 6º Secundaria.');
    }
    return this.repositorio.creartema({
      ...datos,
      academicYearId: idanioacademico,
      gradeLevel: nivelacademico,
      campo: datos.campo || 'Área Integrada',
    });
  }
}

function progresopromedio(temas: Array<{ progressPercent: number }>): number {
  if (temas.length === 0) return 0;
  return Math.round(temas.reduce((total, tema) => total + tema.progressPercent, 0) / temas.length);
}

function estadisticasnivel(temas: Array<{ status: estadoplanestudio; progressPercent: number }>) {
  return {
    total: temas.length,
    completed: temas.filter((tema) => tema.status === estadoplanestudio.COMPLETADO).length,
    avgProgress: progresopromedio(temas),
  };
}
