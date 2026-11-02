import { errorsolicitudincorrecta } from '../../../../core/application/aplicacionerror';
import {
  servicioaplicacion,
  inyectarpuerto,
  dependenciaopcional,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenregistradoraplicacion,
  registroaplicacion,
} from '../../../../core/application/registradoraplicacion.port';
import { urloficialsie } from '../services/urlsieoficial';
import { coincidenombremateria } from '../services/comparadormateriasie.service';
import type { comparacioncalificacionmateria } from '../modelos/modeloauditoriasie';
import type {
  resultadocomparacionestudiante,
  resumenauditoria,
} from '../modelos/modeloauditoriasie';
import { resumircomparacionesie } from '../services/resumircomparacionesie.service';
import {
  tokenrepositorioauditoriacalificacionessie,
  repositorioauditoriacalificacionessie,
} from '../ports/repositorioauditoriacalificacionsie';
import {
  tokennavegadorauditoriacalificacionessie,
  tokenconfiguracionauditoriacalificacionessie,
  navegadorauditoriacalificacionessie,
  configuracionauditoriacalificacionessie,
} from '../ports/ejecucionauditoriacalificacionsie.ports';
import { serviciogestionarinformesauditoriasie } from '../services/gestionarinformesauditoriasie.service';
import { serviciopublicarinformeauditoriasie } from '../services/publicarinformeauditoriasie.service';

export interface opcionesejecucionauditoria {
  courseFilter?: string;
  maxCourses?: number;
  username?: string;
  password?: string;
  visualMode?: boolean;
}

export interface contextooperadorauditoria {
  userId: string;
  ipAddress?: string;
  correlationId?: string;
}

@servicioaplicacion()
export class casousoauditarcalificacionessie {
  constructor(
    @inyectarpuerto(tokenconfiguracionauditoriacalificacionessie)
    private readonly configuracion: configuracionauditoriacalificacionessie,
    @inyectarpuerto(tokenrepositorioauditoriacalificacionessie)
    private readonly repositorio: repositorioauditoriacalificacionessie,
    @inyectarpuerto(tokennavegadorauditoriacalificacionessie)
    private readonly puertonavegador: navegadorauditoriacalificacionessie,
    private readonly gestionarinformes: serviciogestionarinformesauditoriasie,
    private readonly publicarinformes: serviciopublicarinformeauditoriasie,
    @inyectarpuerto(tokenregistradoraplicacion)
    @dependenciaopcional()
    private readonly registrador?: registroaplicacion,
  ) {}

  async obtenerultimaauditoria() {
    return this.gestionarinformes.obtenerultimaauditoria();
  }

  async ejecutarauditoria(
    opciones: opcionesejecucionauditoria | undefined,
    operador: contextooperadorauditoria,
  ): Promise<{
    summary: resumenauditoria;
    students: resultadocomparacionestudiante[];
    message: string;
  }> {
    const configuradosieurl = this.configuracion.urlbase();
    const sieurl = urloficialsie(configuradosieurl);

    const nombreusuario = opciones?.username?.trim() || '';
    const contrasena = opciones?.password?.trim() || '';
    if (!nombreusuario || !contrasena)
      throw new errorsolicitudincorrecta(
        'Ingresa las credenciales del SIE para ejecutar la auditoría.',
      );

    const datosreferencia = await this.repositorio.obtenerdatosreferenciaauditoria();
    const idgestionacademicaactiva = datosreferencia.academicYearId;
    if (!idgestionacademicaactiva) {
      throw new errorsolicitudincorrecta(
        'Activa una gestión académica antes de auditar calificaciones.',
      );
    }

    const visualmodo = opciones?.visualMode === true;
    const maximocursos = opciones?.maxCourses || 4;
    const cursofiltro = opciones?.courseFilter?.trim() || '';

    this.registrador?.informacion(
      `Iniciando auditoría de solo lectura en SIE: ${sieurl} (Filtro: "${cursofiltro}", Máx: ${maximocursos}, Visual: ${visualmodo})`,
    );

    const extraccion = await this.puertonavegador.obtenercalificaciones({
      url: sieurl,
      usuario: nombreusuario,
      contrasena,
      modovisual: visualmodo,
      maximocursos,
      filtrocurso: cursofiltro,
    });
    const cursosauditados = extraccion.cursosauditados;
    const comparacionestodosestudiantes: resultadocomparacionestudiante[] = [];
    const sigcematerias = datosreferencia.subjects;

    for (const advertencia of extraccion.advertencias) {
      this.registrador?.warn(
        `Error al extraer notas del SIE para RUDE ${advertencia.rude}:`,
        advertencia.error,
      );
    }

    const rudesextraidos = [
      ...new Set(
        extraccion.estudiantes
          .map((estudiante) => estudiante.rude.trim())
          .filter((rude) => rude.length > 0),
      ),
    ];
    const encontrados = await this.repositorio.buscarcalificacionesestudiantes(
      rudesextraidos,
      idgestionacademicaactiva,
      1,
    );
    const estudiantesencontrados = new Map(
      encontrados.map((estudiante) => [estudiante.rude, estudiante]),
    );

    for (const extraido of extraccion.estudiantes) {
      const rude = extraido.rude.trim();
      try {
        if (!rude) throw new Error('El portal SIE devolvió una ficha sin código RUDE.');

        const estudiante = estudiantesencontrados.get(rude) ?? null;
        const sigcecalificacionesmapa = new Map<string, number>();
        if (estudiante?.grades) {
          estudiante.grades.forEach((calificacion) =>
            sigcecalificacionesmapa.set(calificacion.subjectId, calificacion.value),
          );
        }

        const comparaciones: comparacioncalificacionmateria[] = [];
        let totalcoincidentes = 0;
        let totaldiscrepancias = 0;
        let siesuma = 0;
        let siecantidad = 0;
        let sigcesuma = 0;
        let sigcecantidad = 0;
        const idsmateriascoincidentes = new Set<string>();

        for (const calificacion of extraido.calificaciones) {
          const coincidentesub = coincidenombremateria(calificacion.materia, sigcematerias);
          const notaSIE = calificacion.notaprimertrimestre;

          if (notaSIE !== null && notaSIE !== undefined) {
            siesuma += notaSIE;
            siecantidad++;
          }

          if (coincidentesub) {
            idsmateriascoincidentes.add(coincidentesub.id);
            const notaSIGCE = sigcecalificacionesmapa.get(coincidentesub.id);

            if (notaSIGCE !== undefined) {
              sigcesuma += notaSIGCE;
              sigcecantidad++;
              const coinciden = notaSIE === notaSIGCE;
              if (coinciden) totalcoincidentes++;
              else totaldiscrepancias++;

              comparaciones.push({
                sieSubject: calificacion.materia,
                sigceSubject: coincidentesub.name,
                sieGrade1T: notaSIE,
                sigceGrade1T: notaSIGCE,
                sieGrade2T: calificacion.notasegundotrimestre,
                status: coinciden ? 'COINCIDE' : 'DISCREPANCIA',
                diff: notaSIE !== null && notaSIE !== undefined ? notaSIE - notaSIGCE : undefined,
              });
            } else {
              comparaciones.push({
                sieSubject: calificacion.materia,
                sigceSubject: coincidentesub.name,
                sieGrade1T: notaSIE,
                sigceGrade1T: null,
                sieGrade2T: calificacion.notasegundotrimestre,
                status: 'SOLO_EN_SIE',
              });
            }
          } else {
            comparaciones.push({
              sieSubject: calificacion.materia,
              sieGrade1T: notaSIE,
              sigceGrade1T: null,
              sieGrade2T: calificacion.notasegundotrimestre,
              status: 'SOLO_EN_SIE',
            });
          }
        }

        if (estudiante?.grades) {
          for (const calificacion of estudiante.grades) {
            if (!idsmateriascoincidentes.has(calificacion.subjectId)) {
              sigcesuma += calificacion.value;
              sigcecantidad++;
              comparaciones.push({
                sieSubject: '— (No presente en SIE)',
                sigceSubject: calificacion.subject.name,
                sieGrade1T: null,
                sigceGrade1T: calificacion.value,
                status: 'SOLO_EN_SIGCE',
              });
            }
          }
        }

        const promediosie = siecantidad > 0 ? Math.round((siesuma / siecantidad) * 10) / 10 : 0;
        const promediosigce =
          sigcecantidad > 0 ? Math.round((sigcesuma / sigcecantidad) * 10) / 10 : 0;

        comparacionestodosestudiantes.push({
          rude,
          studentName:
            extraido.nombre || (estudiante ? `${estudiante.lastName} ${estudiante.firstName}` : ''),
          courseName:
            `${extraido.nivel || ''} - ${extraido.grado || ''} ${extraido.paralelo || ''}`.trim(),
          level: extraido.nivel,
          grade: extraido.grado,
          parallel: extraido.paralelo,
          turn: extraido.turno,
          comparisons: comparaciones,
          overallMatch: totaldiscrepancias === 0 && totalcoincidentes > 0,
          totalSubjectsMatched: totalcoincidentes,
          totalDiscrepancies: totaldiscrepancias,
          sieAverage: promediosie,
          sigceAverage: promediosigce,
        });
      } catch (error) {
        this.registrador?.warn(`Error al comparar notas del SIE para RUDE ${rude}:`, error);
      }
    }

    const resumen = resumircomparacionesie(
      comparacionestodosestudiantes,
      cursosauditados,
      new Date().toISOString(),
    );
    await this.publicarinformes.ejecutar(comparacionestodosestudiantes, resumen, operador);

    return {
      summary: resumen,
      students: comparacionestodosestudiantes,
      message: `Auditoría completada exitosamente para ${resumen.totalStudents} estudiantes en ${cursosauditados} cursos.`,
    };
  }
}
