import {
  servicioaplicacion,
  inyectarpuerto,
  dependenciaopcional,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenregistradoraplicacion,
  registroaplicacion,
} from '../../../../core/application/registradoraplicacion.port';
import { puertoevaluacionalertatemprana } from '../ports/evaluacionalertatemprana.port';
import {
  tokenrepositorioalertas,
  repositorioalertas,
} from '../../domain/repositories/alerta.repository.interface';
import { actualizacionreglaalerta } from '../../domain/entities/alertaregla.entity';
import { validarconfiguracionreglaalerta } from '../../domain/policies/alertareglapolitica';
import {
  generaralertastempranas,
  obtenerventanaalertadias,
  obtenerventanaatrasosdias,
} from '../../domain/policies/evaluaralertastempranas';

function ventanacalendario(ahora: Date, dias: number): Date {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/La_Paz', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(ahora);
  const valor = (tipo: string) => Number(partes.find((parte) => parte.type === tipo)?.value);
  return new Date(Date.UTC(valor('year'), valor('month') - 1, valor('day') - dias + 1));
}

@servicioaplicacion()
export class casousolistaralertas {
  constructor(
    @inyectarpuerto(tokenrepositorioalertas) private readonly repositorio: repositorioalertas,
  ) {}
  ejecutar(idusuario: string, limite: number, desplazamiento: number, estado?: string) {
    return this.repositorio.buscarporusuario(idusuario, limite, desplazamiento, estado);
  }
}

@servicioaplicacion()
export class casousomarcaralertaleida {
  constructor(
    @inyectarpuerto(tokenrepositorioalertas) private readonly repositorio: repositorioalertas,
  ) {}
  ejecutar(id: string, idusuario: string, ipdireccion?: string) {
    return this.repositorio.marcarleida(id, idusuario, {
      userId: idusuario,
      ipAddress: ipdireccion,
    });
  }
}

@servicioaplicacion()
export class casousoactualizarestadoalerta {
  constructor(
    @inyectarpuerto(tokenrepositorioalertas) private readonly repositorio: repositorioalertas,
  ) {}
  ejecutar(
    id: string,
    idusuario: string,
    estado: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
    ipdireccion?: string,
  ) {
    return this.repositorio.actualizarestado(id, idusuario, estado, {
      userId: idusuario,
      ipAddress: ipdireccion,
    });
  }
}

@servicioaplicacion()
export class casousolistarreglasalerta {
  constructor(
    @inyectarpuerto(tokenrepositorioalertas) private readonly repositorio: repositorioalertas,
  ) {}
  ejecutar() {
    return this.repositorio.listarreglas();
  }
}

@servicioaplicacion()
export class casousoactualizarreglaalerta {
  constructor(
    @inyectarpuerto(tokenrepositorioalertas) private readonly repositorio: repositorioalertas,
  ) {}

  ejecutar(entrada: actualizacionreglaalerta, idusuario: string, ipdireccion?: string) {
    validarconfiguracionreglaalerta(entrada);
    return this.repositorio.actualizarregla(entrada, { userId: idusuario, ipAddress: ipdireccion });
  }
}

@servicioaplicacion()
export class casousoevaluaralertasestudiante implements puertoevaluacionalertatemprana {
  constructor(
    @inyectarpuerto(tokenrepositorioalertas) private readonly repositorio: repositorioalertas,
    @inyectarpuerto(tokenregistradoraplicacion)
    @dependenciaopcional()
    private readonly registrador?: registroaplicacion,
  ) {}

  async ejecutarsiesposible(idestudiante: string): Promise<void> {
    try {
      await this.ejecutar(idestudiante);
    } catch (error) {
      this.registrador?.error(
        `No se pudieron actualizar las alertas del estudiante ${idestudiante}`,
        error,
      );
    }
  }

  async ejecutar(idestudiante: string): Promise<void> {
    const reglas = await this.repositorio.listarreglas();
    const reglasactivas = reglas.some((regla) => regla.enabled);
    const ahora = new Date();
    const mediante = new Date(ventanacalendario(ahora, 1).getTime() + 24 * 60 * 60 * 1000 - 1);
    const desde = ventanacalendario(ahora, obtenerventanaalertadias(reglas));
    const desdeatrasos = ventanacalendario(ahora, obtenerventanaatrasosdias(reglas));
    const instantanea = reglasactivas
      ? await this.repositorio.obtenerinstantaneaadvertenciaestudiante(
          idestudiante,
          desde,
          mediante,
          desdeatrasos,
        )
      : null;

    if (!instantanea) {
      await Promise.all([
        this.repositorio.conciliaralertastempranas(idestudiante, 'LOW_GRADE', []),
        this.repositorio.conciliaralertastempranas(idestudiante, 'REPEATED_ABSENCE', []),
        this.repositorio.conciliaralertastempranas(idestudiante, 'REPEATED_LATENESS', []),
      ]);
      return;
    }

    const alertas = generaralertastempranas(instantanea, reglas);
    await this.repositorio.conciliaralertastempranas(
      idestudiante,
      'LOW_GRADE',
      alertas.calificaciones,
    );
    await this.repositorio.conciliaralertastempranas(
      idestudiante,
      'REPEATED_ABSENCE',
      alertas.inasistencias,
    );
    await this.repositorio.conciliaralertastempranas(idestudiante, 'REPEATED_LATENESS', alertas.atrasos);
  }
}

@servicioaplicacion()
export class casousoevaluaralertastodosestudiantes {
  constructor(
    @inyectarpuerto(tokenrepositorioalertas) private readonly repositorio: repositorioalertas,
    private readonly casoevaluaralertasestudiante: casousoevaluaralertasestudiante,
  ) {}

  async ejecutar(): Promise<{ evaluated: number; failed: number }> {
    const idsestudiantes = await this.repositorio.listaridsestudiantesactivos();
    let fallido = 0;
    for (let indice = 0; indice < idsestudiantes.length; indice += 20) {
      const lote = idsestudiantes.slice(indice, indice + 20);
      const resultados = await Promise.allSettled(
        lote.map((idestudiante) => this.casoevaluaralertasestudiante.ejecutar(idestudiante)),
      );
      fallido += resultados.filter((resultado) => resultado.status === 'rejected').length;
    }
    return { evaluated: idsestudiantes.length - fallido, failed: fallido };
  }
}

@servicioaplicacion()
export class casousoprocesarevaluacionesalertaspendientes {
  constructor(
    @inyectarpuerto(tokenrepositorioalertas) private readonly repositorio: repositorioalertas,
    private readonly casoevaluaralertasestudiante: casousoevaluaralertasestudiante,
  ) {}

  async ejecutar(limite = 20, ahora = new Date()): Promise<{ processed: number; retried: number }> {
    const tareas = await this.repositorio.reclamarevaluacionespendientes(
      limite,
      ahora,
      new Date(ahora.getTime() - 5 * 60 * 1000),
    );
    let procesado = 0;
    let reintentado = 0;

    for (const tarea of tareas) {
      try {
        await this.casoevaluaralertasestudiante.ejecutar(tarea.studentId);
        await this.repositorio.completarevaluacionpendiente(tarea.id);
        procesado += 1;
      } catch (error) {
        const intentos = tarea.attempts + 1;
        const reintentardemora = Math.min(1000 * 2 ** intentos, 60 * 60 * 1000);
        const mensaje = error instanceof Error ? error.message.slice(0, 500) : 'Error desconocido';
        await this.repositorio.reintentarevaluacionpendiente(
          tarea.id,
          intentos,
          mensaje,
          new Date(ahora.getTime() + reintentardemora),
        );
        reintentado += 1;
      }
    }

    return { processed: procesado, retried: reintentado };
  }
}
