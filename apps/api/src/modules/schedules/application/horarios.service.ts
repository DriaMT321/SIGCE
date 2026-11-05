import { servicioaplicacion, inyectarpuerto } from '../../../core/application/aplicacioninyeccion';
import { actorusuario } from '../../../core/application/actorusuario';
import { errornoencontrado, errorprohibido } from '../../../core/application/aplicacionerror';
import { rolusuario } from '@academic/domain-kernel';
import {
  tokenrepositoriohorarios,
  filtroshorario,
  repositoriohorarios,
  datosescriturahorario,
} from '../domain/repositories/horario.repository.interface';
import { casousoobtenermihorario } from './use-cases/obtenermihorario.use-case';
import { casousogenerarhorariosemanal } from './use-cases/generarhorariosemanal.use-case';

@servicioaplicacion()
export class serviciohorarios {
  constructor(
    @inyectarpuerto(tokenrepositoriohorarios) private readonly repositorio: repositoriohorarios,
    private readonly consultamihorario: casousoobtenermihorario,
    private readonly generadorhorariosemanal: casousogenerarhorariosemanal,
  ) {}

  async listar(filtros: filtroshorario, usuario: actorusuario) {
    if (usuario.role === rolusuario.TEACHER) {
      const iddocentepropio = await this.repositorio.buscariddocenteporusuario(usuario.id);
      if (!iddocentepropio) throw new errornoencontrado('Docente no encontrado para este usuario');
      if (filtros.teacherId && filtros.teacherId !== iddocentepropio) {
        throw new errorprohibido('Solo puedes consultar tu propio horario docente');
      }
      if (filtros.courseId) {
        const propio = await this.repositorio.obtenerhorariodocente(iddocentepropio, true);
        if (!propio.assignments.some((asignacion) => asignacion.courseId === filtros.courseId)) {
          throw new errorprohibido('No tienes una asignación vigente para este curso');
        }
      }
      return this.repositorio.listar({ ...filtros, teacherId: iddocentepropio, soloGestionActiva: true });
    }
    return this.repositorio.listar(filtros);
  }

  async obtenerhorariocurso(idcurso: string, usuario: actorusuario) {
    if (usuario.role === rolusuario.PARENT || usuario.role === rolusuario.STUDENT) {
      const [perfilestudiante, perfilfamiliar] = await Promise.all([
        this.repositorio.buscarperfilhorarioestudiante(usuario.id),
        this.repositorio.buscarperfilhorariofamiliar(usuario.id),
      ]);
      if (perfilestudiante?.activeCourseId !== idcurso && !perfilfamiliar?.children.some((hijo) => hijo.activeCourseId === idcurso)) {
        throw new errorprohibido('No tienes un estudiante vinculado a este curso');
      }
    }
    return this.repositorio.obtenerhorariocurso(idcurso);
  }

  asignarmateriasdocente(datos: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
    weeklyPeriods?: number | null;
  }) {
    return this.repositorio.asignarmateriasdocente(datos);
  }

  reemplazarmateriasdocente(datos: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
  }) {
    return this.repositorio.reemplazarmateriasdocente(datos);
  }

  async obtenerhorariodocente(iddocente: string, usuario: actorusuario) {
    return this.repositorio.obtenerhorariodocente(iddocente, usuario.role === rolusuario.TEACHER);
  }

  obtenermihorario(usuario: actorusuario) {
    return this.consultamihorario.ejecutar(usuario);
  }

  insertaroactualizar(datos: datosescriturahorario) {
    return this.repositorio.insertaroactualizar(datos);
  }

  generarautomaticamente(idcurso: string) {
    return this.generadorhorariosemanal.ejecutar(idcurso);
  }

  crear(datos: datosescriturahorario) {
    return this.repositorio.crear(datos);
  }

  eliminar(id: string) {
    return this.repositorio.eliminar(id);
  }
}
