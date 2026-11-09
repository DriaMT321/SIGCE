import {
  errornoencontrado,
  errorprohibido,
  errorsolicitudincorrecta,
} from '../../../core/application/aplicacionerror';
import { servicioaplicacion, inyectarpuerto } from '../../../core/application/aplicacioninyeccion';
import { actorusuario } from '../../../core/application/actorusuario';
import { rolusuario } from '@academic/domain-kernel';
import {
  datosactualizareventoacademico,
  datoscreacioneventoacademico,
  filtroslistadoeventosacademicos,
  repositorioeventosacademicos,
  tokenrepositorioeventosacademicos,
} from './ports/eventosacademicos.port';

@servicioaplicacion()
export class servicioeventosacademicos {
  constructor(
    @inyectarpuerto(tokenrepositorioeventosacademicos)
    private readonly repositorio: repositorioeventosacademicos,
  ) {}

  async listar(
    usuario: actorusuario,
    parametros: { desde?: string; hasta?: string; courseId?: string },
  ) {
    const { desde, hasta } = this.validarrango(parametros.desde, parametros.hasta);
    const privilegioadministrativo = this.esadministrativo(usuario.role);
    const cursosvisibles = privilegioadministrativo
      ? []
      : await this.repositorio.buscarcursosvisibles(usuario);
    const filtros: filtroslistadoeventosacademicos = {
      sinrestricciondecursos: privilegioadministrativo,
      cursosvisibles,
      courseId: parametros.courseId,
      desde,
      hasta,
    };
    return this.repositorio.listar(filtros);
  }

  async crear(usuario: actorusuario, datos: Omit<datoscreacioneventoacademico, 'createdById'>) {
    this.exigirrolgestor(usuario.role);
    this.validartitulo(datos.title);
    this.validarfechas(datos.startsAt, datos.endsAt);
    await this.validarcurso(usuario, datos.targetCourseId);
    return this.repositorio.crear({
      ...datos,
      title: datos.title.trim(),
      description: datos.description?.trim() || null,
      location: datos.location?.trim() || null,
      targetCourseId: datos.targetCourseId || null,
      createdById: usuario.id,
    });
  }

  async actualizar(usuario: actorusuario, id: string, cambios: datosactualizareventoacademico) {
    this.exigirrolgestor(usuario.role);
    const existente = await this.repositorio.buscarporid(id);
    if (!existente) throw new errornoencontrado('La actividad académica no existe.');
    await this.exigirpropietarioparaeditar(usuario, existente.createdById, existente.targetCourseId);

    const title = cambios.title ?? existente.title;
    const startsAt = cambios.startsAt ?? existente.startsAt;
    const endsAt = cambios.endsAt ?? existente.endsAt;
    const targetCourseId =
      cambios.targetCourseId !== undefined ? cambios.targetCourseId : existente.targetCourseId;
    this.validartitulo(title);
    this.validarfechas(startsAt, endsAt);
    if (cambios.status === 'REALIZADO' && endsAt.getTime() > Date.now()) {
      throw new errorsolicitudincorrecta('Una actividad futura no puede marcarse como realizada.');
    }
    if (cambios.targetCourseId !== undefined || existente.targetCourseId !== targetCourseId) {
      await this.validarcurso(usuario, targetCourseId);
    }

    return this.repositorio.actualizar(id, {
      ...cambios,
      ...(cambios.title !== undefined ? { title: cambios.title.trim() } : {}),
      ...(cambios.description !== undefined
        ? { description: cambios.description?.trim() || null }
        : {}),
      ...(cambios.location !== undefined ? { location: cambios.location?.trim() || null } : {}),
      ...(cambios.targetCourseId !== undefined
        ? { targetCourseId: cambios.targetCourseId || null }
        : {}),
    });
  }

  async cancelar(usuario: actorusuario, id: string) {
    this.exigirrolgestor(usuario.role);
    const existente = await this.repositorio.buscarporid(id);
    if (!existente) throw new errornoencontrado('La actividad académica no existe.');
    await this.exigirpropietarioparaeditar(usuario, existente.createdById, existente.targetCourseId);
    if (existente.status === 'CANCELADO') {
      throw new errorsolicitudincorrecta('La actividad ya está cancelada.');
    }
    return this.repositorio.actualizar(id, { status: 'CANCELADO' });
  }

  private async validarcurso(usuario: actorusuario, cursoId?: string | null): Promise<void> {
    if (!cursoId) {
      if (usuario.role === rolusuario.TEACHER) {
        throw new errorprohibido('Los docentes deben dirigir sus actividades a un curso asignado.');
      }
      return;
    }
    if (!(await this.repositorio.existecurso(cursoId))) {
      throw new errornoencontrado('El curso seleccionado ya no está disponible.');
    }
    if (
      usuario.role === rolusuario.TEACHER &&
      !(await this.repositorio.docentetieneasignacion(usuario.id, cursoId))
    ) {
      throw new errorprohibido('Solo puedes programar actividades para tus cursos asignados.');
    }
  }

  private async exigirpropietarioparaeditar(
    usuario: actorusuario,
    creadorId: string,
    cursoId: string | null,
  ): Promise<void> {
    if (this.esadministrativo(usuario.role)) return;
    if (
      usuario.role !== rolusuario.TEACHER ||
      creadorId !== usuario.id ||
      !cursoId ||
      !(await this.repositorio.docentetieneasignacion(usuario.id, cursoId))
    ) {
      throw new errorprohibido('Solo puedes modificar las actividades que creaste para tus cursos.');
    }
  }

  private validarfechas(inicio: Date, fin: Date): void {
    if (!Number.isFinite(inicio.getTime()) || !Number.isFinite(fin.getTime())) {
      throw new errorsolicitudincorrecta('Ingresa fechas y horas válidas para la actividad.');
    }
    if (fin.getTime() <= inicio.getTime()) {
      throw new errorsolicitudincorrecta('La fecha y hora de finalización debe ser posterior al inicio.');
    }
  }

  private validarrango(desde?: string, hasta?: string): Pick<filtroslistadoeventosacademicos, 'desde' | 'hasta'> {
    const inicio = desde ? new Date(desde) : undefined;
    const fin = hasta ? new Date(hasta) : undefined;
    if ((inicio && !Number.isFinite(inicio.getTime())) || (fin && !Number.isFinite(fin.getTime()))) {
      throw new errorsolicitudincorrecta('El rango de fechas del calendario no es válido.');
    }
    if (inicio && fin && fin.getTime() <= inicio.getTime()) {
      throw new errorsolicitudincorrecta('El final del rango debe ser posterior al inicio.');
    }
    return { ...(inicio ? { desde: inicio } : {}), ...(fin ? { hasta: fin } : {}) };
  }

  private validartitulo(titulo: string): void {
    const normalizado = titulo.trim();
    if (normalizado.length < 3 || normalizado.length > 120) {
      throw new errorsolicitudincorrecta('El título debe tener entre 3 y 120 caracteres.');
    }
  }

  private exigirrolgestor(rol: rolusuario): void {
    if (![rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER].includes(rol)) {
      throw new errorprohibido('No tienes permiso para gestionar actividades académicas.');
    }
  }

  private esadministrativo(rol: rolusuario): boolean {
    return [rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY].includes(rol);
  }
}
