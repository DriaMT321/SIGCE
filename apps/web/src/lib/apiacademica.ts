import { z } from 'zod';
import { clienteapi } from './clienteapi';
import {
  siesincronizacionlistarrespuestaesquema,
  siesincronizacionvistapreviarespuestaesquema,
  siesincronizaciondisparadorrespuestaesquema,
  siesincronizacionesquema,
  type siesincronizacionlistarfiltros,
} from '../features/sie-sync/application/esquemasincronizacionsie';
import type { administradousuarioregistro } from '../features/users/application/gestionusuarios';
import type {
  creardocenteentrada,
  docenteactualizarentrada,
  crearfamiliarentrada,
  familiaractualizarentrada,
} from '../features/community/application/gestioncomunidad';
import type { cursoregistroentrada } from '../features/courses/application/catalogodecursos';
import type { estudianteregistroentrada, estudianterelacion } from '../features/students/application/gestionestudiantes';
import type {
  crearinscripcionentrada,
  inscripcionestado,
} from '../features/enrollments/application/gestionmatricula';
import type { crearcalificacionentrada } from '../features/grades/application/gestioncalificaciones';
import type { registroasistenciaentrada } from '../features/attendance/application/gestionasistencia';
import type { crearasignacionentrada } from '../features/assignments/application/gestionasignacion';

import {
  estudianteesquema,
  estudiantedocumentoreferenciaesquema,
  cursoesquema,
  inscripcionesquema,
  calificacionesquema,
  calificacioncorreccionesquema,
  asistenciaesquema,
  alertareglaesquema,
  docenteesquema,
  familiaresquema,
  listarrespuesta,
  datosrespuesta,
  asignacionesquema,
  academicogestionesquema,
  periodoesquema,
  materiaesquema,
} from './esquemasapiacademica';
import type {
  estudiantedocumentoreferencia,
  curso,
  calificacion,
  docente,
  alertaregla,
  periodo,
  periodocierrevistaprevia,
  familiar,
  clasehorarioelemento,
  curriculotemaelemento,
  myhorariodatos,
} from './esquemasapiacademica';
export * from './esquemasapiacademica';

export const academicoapi = {
  async buscarcoincidenciasestudiante(datos: { rude?: string; ci?: string }) {
    const respuesta = await clienteapi.post('/students/duplicates', datos);
    return datosrespuesta(z.array(z.object({
      id: z.string(), rude: z.string(), ci: z.string(),
      firstName: z.string(), lastName: z.string(), isActive: z.boolean(),
      deletedAt: z.string().nullable(),
    }))).parse(respuesta.data).data;
  },
  async listarestudiantes(buscar?: string, limite = 1000, desplazamiento = 0, cursoid?: string) {
    const respuesta = await clienteapi.get('/students', {
      params: { search: buscar, limit: limite, offset: desplazamiento, courseId: cursoid },
    });
    return listarrespuesta(estudianteesquema).parse(respuesta.data);
  },
  async crearestudiante(datos: estudianteregistroentrada) {
    const respuesta = await clienteapi.post('/students', datos);
    return datosrespuesta(
      z.object({
        student: estudianteesquema,
        activationToken: z.string(),
        activationExpiresAt: z.string(),
      }),
    ).parse(respuesta.data).data;
  },
  async actualizarestudiante(id: string, datos: { ci: string }) {
    const respuesta = await clienteapi.patch(`/students/${id}`, datos);
    return datosrespuesta(estudianteesquema).parse(respuesta.data).data;
  },
  async vincularestudiantefamiliar(
    idestudiante: string,
    datos: { parentId: string; relationship: estudianterelacion },
  ) {
    const respuesta = await clienteapi.patch(`/students/${idestudiante}`, datos);
    return datosrespuesta(estudianteesquema).parse(respuesta.data).data;
  },
  async actualizarvinculofamiliar(
    parentId: string,
    studentId: string,
    relationship: estudianterelacion,
  ): Promise<familiar> {
    const respuesta = await clienteapi.patch(`/parents/${parentId}/students/${studentId}`, { relationship });
    return datosrespuesta(familiaresquema).parse(respuesta.data).data;
  },
  async eliminarvinculofamiliar(parentId: string, studentId: string): Promise<familiar> {
    const respuesta = await clienteapi.delete(`/parents/${parentId}/students/${studentId}`);
    return datosrespuesta(familiaresquema).parse(respuesta.data).data;
  },
  async listarestudiantedocumentoreferencias(idestudiante: string) {
    const respuesta = await clienteapi.get(`/students/${idestudiante}/documents`);
    return datosrespuesta(z.array(estudiantedocumentoreferenciaesquema)).parse(respuesta.data).data;
  },
  async crearestudiantedocumentoreferencia(
    idestudiante: string,
    datos: {
      documentType: estudiantedocumentoreferencia['documentType'];
      reference: string;
      notes?: string;
    },
  ) {
    const respuesta = await clienteapi.post(`/students/${idestudiante}/documents`, datos);
    return datosrespuesta(estudiantedocumentoreferenciaesquema).parse(respuesta.data).data;
  },
  async reemisionestudianteactivacion(id: string) {
    const respuesta = await clienteapi.post(`/students/${id}/activation`);
    return datosrespuesta(
      z.object({
        activationToken: z.string(),
        activationExpiresAt: z.string(),
      }),
    ).parse(respuesta.data).data;
  },
  async eliminarestudiante(id: string) {
    const respuesta = await clienteapi.delete(`/students/${id}`);
    return respuesta.data;
  },
  async listarcursos(buscar?: string, desplazamiento = 0) {
    const respuesta = await clienteapi.get('/courses', {
      params: { search: buscar, limit: 100, offset: desplazamiento },
    });
    return listarrespuesta(cursoesquema).parse(respuesta.data);
  },
  async crearcurso(datos: cursoregistroentrada) {
    const respuesta = await clienteapi.post('/courses', datos);
    return datosrespuesta(cursoesquema).parse(respuesta.data).data;
  },
  async listardocentes(buscar?: string) {
    const respuesta = await clienteapi.get('/teachers', { params: { search: buscar, limit: 100 } });
    return listarrespuesta(docenteesquema).parse(respuesta.data);
  },
  async creardocente(datos: creardocenteentrada) {
    const respuesta = await clienteapi.post('/teachers', datos);
    return datosrespuesta(docenteesquema).parse(respuesta.data).data;
  },
  async actualizardocente(id: string, datos: docenteactualizarentrada) {
    const respuesta = await clienteapi.patch(`/teachers/${id}`, datos);
    return datosrespuesta(docenteesquema).parse(respuesta.data).data;
  },
  async eliminardocente(id: string) {
    const respuesta = await clienteapi.delete(`/teachers/${id}`);
    return respuesta.data;
  },
  async listarfamiliares(buscar?: string, limite = 100, desplazamiento = 0) {
    const respuesta = await clienteapi.get('/parents', {
      params: { search: buscar, limit: limite, offset: desplazamiento },
    });
    return listarrespuesta(familiaresquema).parse(respuesta.data);
  },
  async crearfamiliar(datos: crearfamiliarentrada) {
    const respuesta = await clienteapi.post('/parents', datos);
    return datosrespuesta(familiaresquema).parse(respuesta.data).data;
  },
  async actualizarfamiliar(id: string, datos: familiaractualizarentrada) {
    const respuesta = await clienteapi.patch(`/parents/${id}`, datos);
    return datosrespuesta(familiaresquema).parse(respuesta.data).data;
  },
  async eliminarfamiliar(id: string) {
    const respuesta = await clienteapi.delete(`/parents/${id}`);
    return respuesta.data;
  },
  async listaracademicogestiones() {
    const respuesta = await clienteapi.get('/academic-years');
    return z.object({ data: z.array(academicogestionesquema) }).parse(respuesta.data).data;
  },
  async crearanioacademico(datos: {
    year: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
  }) {
    const respuesta = await clienteapi.post('/academic-years', datos);
    return datosrespuesta(academicogestionesquema).parse(respuesta.data).data;
  },
  async actualizaranioacademico(
    id: string,
    datos: {
      year?: number;
      name?: string;
      startDate?: string;
      endDate?: string;
      isActive?: boolean;
      isClosed?: boolean;
    },
  ) {
    const respuesta = await clienteapi.patch(`/academic-years/${id}`, datos);
    return datosrespuesta(academicogestionesquema).parse(respuesta.data).data;
  },
  async eliminaranioacademico(id: string) {
    const respuesta = await clienteapi.delete(`/academic-years/${id}`);
    return respuesta.data as { statusCode: number; message: string };
  },
  async listarperiodos(idgestionacademica?: string) {
    const respuesta = await clienteapi.get('/periods', {
      params: { academicYearId: idgestionacademica },
    });
    return z.object({ data: z.array(periodoesquema) }).parse(respuesta.data).data;
  },
  async crearperiodo(datos: {
    academicYearId: string;
    name: string;
    number: number;
    startDate: string;
    endDate: string;
  }) {
    const respuesta = await clienteapi.post('/periods', datos);
    return datosrespuesta(periodoesquema).parse(respuesta.data).data;
  },
  async actualizarperiodo(
    id: string,
    datos: {
      name?: string;
      isClosed?: boolean;
      confirmClose?: boolean;
      expectedGradeCount?: number;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const respuesta = await clienteapi.patch(`/periods/${id}`, datos);
    return respuesta.data as { statusCode: number; message: string; data: periodo };
  },
  async obtenerperiodocierrevistaprevia(id: string) {
    const respuesta = await clienteapi.get(`/periods/${id}/closure-preview`);
    return z
      .object({
        data: z.object({
          id: z.string(),
          name: z.string(),
          isClosed: z.boolean(),
          gradeCount: z.number().int().nonnegative(),
          studentCount: z.number().int().nonnegative(),
        }),
      })
      .parse(respuesta.data).data as periodocierrevistaprevia;
  },
  async listarmaterias(buscar?: string, courseId?: string) {
    const respuesta = await clienteapi.get('/subjects', { params: { search: buscar, courseId } });
    return z.object({ data: z.array(materiaesquema) }).parse(respuesta.data).data;
  },
  async crearmateria(datos: {
    name: string;
    code: string;
    description?: string;
    area?: string;
  }) {
    const respuesta = await clienteapi.post('/subjects', datos);
    return datosrespuesta(materiaesquema).parse(respuesta.data).data;
  },
  async actualizarmateria(
    id: string,
    datos: {
      name?: string;
      code?: string;
      description?: string;
      area?: string;
    },
  ) {
    const respuesta = await clienteapi.patch(`/subjects/${id}`, datos);
    return datosrespuesta(materiaesquema).parse(respuesta.data).data;
  },
  async eliminarmateria(id: string) {
    const respuesta = await clienteapi.delete(`/subjects/${id}`);
    return respuesta.data as { statusCode: number; message: string };
  },
  async listarinscripciones(idestudiante?: string) {
    const respuesta = await clienteapi.get('/enrollments', {
      params: { studentId: idestudiante, limit: idestudiante ? 100 : 1000 },
    });
    return listarrespuesta(inscripcionesquema).parse(respuesta.data);
  },
  async crearinscripcion(datos: crearinscripcionentrada) {
    const respuesta = await clienteapi.post('/enrollments', datos);
    return datosrespuesta(inscripcionesquema).parse(respuesta.data).data;
  },
  async actualizarinscripcion(id: string, datos: { status: inscripcionestado }) {
    const respuesta = await clienteapi.patch(`/enrollments/${id}`, datos);
    return datosrespuesta(inscripcionesquema).parse(respuesta.data).data;
  },
  async actualizarestadomultipleinscripcion(ids: string[], status: inscripcionestado) {
    const respuesta = await clienteapi.post('/enrollments/bulk-status', { ids, status });
    return z
      .object({
        data: z.object({
          updatedCount: z.number().int().nonnegative(),
          unchangedCount: z.number().int().nonnegative(),
        }),
      })
      .parse(respuesta.data).data;
  },
  async listarcalificaciones(parametros?: {
    search?: string;
    studentId?: string;
    subjectId?: string;
    enrollmentId?: string;
    courseId?: string;
    periodId?: string;
    limit?: number;
    offset?: number;
  }) {
    const respuesta = await clienteapi.get('/grades', {
      params: { ...parametros, limit: parametros?.limit ?? 200 },
    });
    return listarrespuesta(calificacionesquema).parse(respuesta.data);
  },
  async crearcalificacion(datos: crearcalificacionentrada) {
    const respuesta = await clienteapi.post('/grades', datos);
    return datosrespuesta(calificacionesquema).parse(respuesta.data).data;
  },
  async crearmasivocalificaciones(datos: {
    courseId: string;
    subjectId: string;
    periodId: string;
    grades: Array<{ studentId: string; enrollmentId: string; value: number; remarks?: string }>;
    reason?: string;
  }) {
    const respuesta = await clienteapi.post('/grades/bulk', datos);
    return respuesta.data as {
      statusCode: number;
      message: string;
      data: { count: number; items: calificacion[] };
    };
  },
  async actualizarcalificacion(id: string, datos: { value: number; remarks?: string | null }) {
    const respuesta = await clienteapi.patch(`/grades/${id}`, datos);
    return datosrespuesta(calificacionesquema).parse(respuesta.data).data;
  },
  async publicarcalificaciones(datos: {
    courseId: string;
    subjectId: string;
    periodId: string;
    reason?: string;
  }) {
    const respuesta = await clienteapi.post('/grades/publish', datos);
    return respuesta.data as {
      statusCode: number;
      message: string;
      data: { publishedCount: number; publishedAt: string };
    };
  },
  async enviarcalificacioncorreccion(datos: {
    gradeId: string;
    proposedValue: number;
    reason: string;
    evidenceReference: string;
  }) {
    const respuesta = await clienteapi.post('/grades/corrections', datos);
    return datosrespuesta(calificacioncorreccionesquema).parse(respuesta.data).data;
  },
  async listarcalificacioncorrecciones(parametros?: {
    status?: 'PENDING' | 'EXECUTED' | 'REJECTED';
    limit?: number;
    offset?: number;
  }) {
    const respuesta = await clienteapi.get('/grades/corrections', { params: parametros });
    return listarrespuesta(calificacioncorreccionesquema).parse(respuesta.data);
  },
  async decidircalificacioncorreccion(
    id: string,
    datos: { approve: boolean; decisionReason: string },
  ) {
    const respuesta = await clienteapi.patch(`/grades/corrections/${id}/decision`, datos);
    return datosrespuesta(calificacioncorreccionesquema).parse(respuesta.data).data;
  },
  async listarasistencia(parametros?: {
    studentId?: string;
    courseId?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  }) {
    const respuesta = await clienteapi.get('/attendance', {
      params: { ...parametros, limit: parametros?.limit ?? 200 },
    });
    return listarrespuesta(asistenciaesquema).parse(respuesta.data);
  },
  async crearasistencia(datos: registroasistenciaentrada) {
    const respuesta = await clienteapi.post('/attendance', datos);
    return datosrespuesta(asistenciaesquema).parse(respuesta.data).data;
  },
  async listaralertas(parametros?: { status?: string }) {
    const respuesta = await clienteapi.get('/alerts', { params: { limit: 100, ...parametros } });
    return z
      .object({
        data: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            message: z.string(),
            severity: z.string(),
            status: z.string().optional(),
            isRead: z.boolean(),
            createdAt: z.string(),
          }),
        ),
        total: z.number(),
      })
      .parse(respuesta.data);
  },
  async listaralertareglas() {
    const respuesta = await clienteapi.get('/alerts/rules');
    return z.object({ data: z.array(alertareglaesquema) }).parse(respuesta.data).data;
  },
  async actualizaralertaregla(
    clave: alertaregla['key'],
    entrada: {
      enabled: boolean;
      severity: alertaregla['severity'];
      gradeThreshold?: number;
      absenceThreshold?: number;
      absenceWindowDays?: number;
    },
  ) {
    const respuesta = await clienteapi.put(`/alerts/rules/${clave}`, entrada);
    return alertareglaesquema.parse(
      z.object({ data: alertareglaesquema }).parse(respuesta.data).data,
    );
  },
  async evaluartodosestudiantealertas() {
    const respuesta = await clienteapi.patch('/alerts/rules/evaluate');
    return z
      .object({
        data: z.object({ evaluated: z.number(), failed: z.number() }),
      })
      .parse(respuesta.data).data;
  },
  async marcaralertaleer(id: string) {
    const respuesta = await clienteapi.patch(`/alerts/${id}/read`);
    return z
      .object({ data: z.object({ id: z.string(), isRead: z.boolean() }) })
      .parse(respuesta.data).data;
  },
  async actualizaralertaestado(id: string, estado: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') {
    const respuesta = await clienteapi.patch(`/alerts/${id}/status`, { status: estado });
    return z
      .object({ data: z.object({ id: z.string(), status: z.string() }) })
      .parse(respuesta.data).data;
  },
  async listarauditoria(parametros?: {
    correlationId?: string;
    entity?: string;
    studentId?: string;
  }) {
    const respuesta = await clienteapi.get('/audit', { params: { limit: 100, ...parametros } });
    return z
      .object({
        data: z.array(
          z.object({
            id: z.string(),
            action: z.string(),
            entity: z.string(),
            entityId: z.string(),
            userId: z.string().nullable(),
            reason: z.string().nullable().optional(),
            correlationId: z.string().nullable().optional(),
            previousValue: z.unknown().nullable(),
            newValue: z.unknown().nullable(),
            createdAt: z.string(),
          }),
        ),
        total: z.number(),
      })
      .parse(respuesta.data);
  },
  async listarsiesincronizaciones(filtros: siesincronizacionlistarfiltros = {}) {
    const respuesta = await clienteapi.get('/sie-sync', { params: { limit: 20, ...filtros } });
    return siesincronizacionlistarrespuestaesquema.parse(respuesta.data);
  },
  async vistapreviasiesincronizacion(filtros: {
    academicYearId: string;
    periodNumber: number;
    courseId?: string;
    subjectId?: string;
  }) {
    const respuesta = await clienteapi.post('/sie-sync/preview', filtros);
    return siesincronizacionvistapreviarespuestaesquema.parse(respuesta.data).data;
  },
  async disparadorsiesincronizacion(entrada: {
    academicYearId: string;
    periodNumber: number;
    courseId?: string;
    subjectId?: string;
    confirmSend: true;
    expectedFingerprint: string;
    expectedGradeCount: number;
    idempotencyKey: string;
  }) {
    const { idempotencyKey, ...datos } = entrada;
    const respuesta = await clienteapi.post('/sie-sync/trigger', datos, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
    return siesincronizaciondisparadorrespuestaesquema.parse(respuesta.data).data;
  },
  async resolversiediscrepancia(
    elementoid: string,
    datos: {
      decision: 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';
      reason: string;
    },
  ) {
    const respuesta = await clienteapi.patch(
      `/sie-sync/items/${elementoid}/resolve-discrepancy`,
      datos,
    );
    return respuesta.data;
  },
  async resolversiediscrepanciagrupo(
    grupoid: string,
    datos: {
      decision: 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';
      reason: string;
    },
  ) {
    const respuesta = await clienteapi.patch(
      `/sie-sync/groups/${grupoid}/resolve-discrepancy`,
      datos,
    );
    return z
      .object({
        statusCode: z.number(),
        message: z.string(),
        data: z.object({ groupId: z.string(), resolvedItemCount: z.number().int().nonnegative() }),
      })
      .parse(respuesta.data).data;
  },
  async reintentarsiesincronizacionelemento(elementoid: string, datos: { reason: string }) {
    const respuesta = await clienteapi.post(`/sie-sync/items/${elementoid}/retry`, datos);
    return z
      .object({
        statusCode: z.number(),
        message: z.string(),
        data: z.object({
          synchronizationId: z.string(),
          itemId: z.string(),
          jobId: z.string().nullable(),
        }),
      })
      .parse(respuesta.data).data;
  },
  async reanudarsiesincronizacion(id: string, datos: { reason: string }) {
    const respuesta = await clienteapi.post(`/sie-sync/synchronizations/${id}/resume`, datos);
    return z
      .object({
        statusCode: z.number(),
        message: z.string(),
        data: z.object({
          synchronizationId: z.string(),
          jobIds: z.array(z.string()),
          status: z.literal('QUEUED'),
        }),
      })
      .parse(respuesta.data).data;
  },
  async obtenersiesincronizacion(id: string) {
    const respuesta = await clienteapi.get(`/sie-sync/status/${id}`);
    return siesincronizacionesquema.parse(respuesta.data.data);
  },

  // Horarios de Clases
  async listarhorarios(parametros?: { courseId?: string; teacherId?: string; dayOfWeek?: string }) {
    const respuesta = await clienteapi.get('/schedules', { params: parametros });
    return respuesta.data as { statusCode: number; data: clasehorarioelemento[]; total: number };
  },
  async obtenermyhorario() {
    const respuesta = await clienteapi.get('/schedules/my-schedule');
    return respuesta.data as { statusCode: number; message: string; data: myhorariodatos };
  },
  async obtenercursohorario(cursoid: string) {
    const respuesta = await clienteapi.get(`/schedules/course/${cursoid}`);
    return respuesta.data as {
      statusCode: number;
      data: {
        course: curso;
        schedules: clasehorarioelemento[];
        teacherSubjects: Record<string, unknown>[];
      };
    };
  },
  async obtenerdocentehorario(docenteid: string) {
    const respuesta = await clienteapi.get(`/schedules/teacher/${docenteid}`);
    return respuesta.data as {
      statusCode: number;
      data: {
        teacher: docente;
        schedules: clasehorarioelemento[];
        assignments: Record<string, unknown>[];
      };
    };
  },

  // Avance Curricular
  async listarcurriculo(parametros?: {
    courseId?: string;
    gradeLevel?: number;
    subjectId?: string;
    periodNumber?: number;
    status?: string;
    search?: string;
  }) {
    const respuesta = await clienteapi.get('/curriculum', { params: parametros });
    return respuesta.data as { statusCode: number; data: curriculotemaelemento[]; total: number };
  },
  async obtenercurriculoestadisticas() {
    const respuesta = await clienteapi.get('/curriculum/stats');
    return respuesta.data as {
      statusCode: number;
      data: {
        totalTopics: number;
        completed: number;
        inProgress: number;
        planned: number;
        averageProgress: number;
        byLevel: {
          inicial: { total: number; completed: number; avgProgress: number };
          primaria: { total: number; completed: number; avgProgress: number };
          secundaria: { total: number; completed: number; avgProgress: number };
        };
      };
    };
  },
  async actualizarcurriculoavance(
    id: string,
    datos: { status?: string; progressPercent?: number },
  ) {
    const respuesta = await clienteapi.patch(`/curriculum/${id}/progress`, datos);
    return respuesta.data as { statusCode: number; data: curriculotemaelemento };
  },

  // Gestión de Usuarios Institucionales
  async listarusuarios(parametros?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const respuesta = await clienteapi.get('/users', { params: parametros });
    return respuesta.data as {
      statusCode: number;
      message: string;
      data: Array<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: 'ADMINISTRATIVE' | 'SECRETARY' | 'TEACHER' | 'PARENT' | 'STUDENT';
        isActive: boolean;
        passwordSetupRequired: boolean;
        createdAt: string;
        updatedAt?: string;
      }>;
      total: number;
    };
  },
  async crearusuario(datos: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'SECRETARY';
  }) {
    const respuesta = await clienteapi.post('/users', datos);
    return respuesta.data as { statusCode: number; message: string; data: Record<string, unknown> };
  },
  async actualizarusuario(
    id: string,
    datos: Partial<Pick<administradousuarioregistro, 'firstName' | 'lastName' | 'isActive'>>,
  ) {
    const respuesta = await clienteapi.patch(`/users/${id}`, datos);
    return respuesta.data as { statusCode: number; message: string; data: Record<string, unknown> };
  },
  async restablecerusuariocontrasena(id: string, contrasenanueva: string) {
    const respuesta = await clienteapi.patch(`/users/${id}/password`, {
      newPassword: contrasenanueva,
    });
    return respuesta.data as { statusCode: number; message: string; data: { reset: true } };
  },

  // Tareas y Exámenes (Assignments)
  async listarasignaciones(parametros?: {
    courseId?: string;
    subjectId?: string;
    teacherId?: string;
    type?: string;
    status?: string;
    search?: string;
  }) {
    const respuesta = await clienteapi.get('/assignments', { params: parametros });
    return listarrespuesta(asignacionesquema).parse(respuesta.data);
  },
  async crearasignacion(datos: crearasignacionentrada) {
    const respuesta = await clienteapi.post('/assignments', datos);
    return datosrespuesta(asignacionesquema).parse(respuesta.data).data;
  },
  async actualizarasignacion(
    id: string,
    datos: { status: 'PENDIENTE' | 'EN_PROGRESO' | 'FINALIZADO' | 'CANCELADO' },
  ) {
    const respuesta = await clienteapi.patch(`/assignments/${id}`, datos);
    return datosrespuesta(asignacionesquema).parse(respuesta.data).data;
  },
  async eliminarasignacion(id: string) {
    const respuesta = await clienteapi.delete(`/assignments/${id}`);
    return respuesta.data as { statusCode: number; message: string };
  },

  // Horarios - Edición Manual y Generación Automática
  async asignarmateriasdocente(datos: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
    weeklyPeriods?: number | null;
  }) {
    const respuesta = await clienteapi.post('/schedules/teacher-subjects', datos);
    return respuesta.data as { statusCode: number; data: { created: number } };
  },
  async reemplazarmateriasdocente(datos: {
    courseId: string;
    teacherId: string;
    subjectIds: string[];
  }) {
    const respuesta = await clienteapi.put('/schedules/teacher-subjects', datos);
    return respuesta.data as {
      statusCode: number;
      data: {
        added: number;
        removed: number;
        assignments: Array<{
          id: string;
          courseId: string;
          subjectId: string;
          weeklyPeriods: number | null;
          course: { id: string; name: string; gradeLevel: number; section: string };
          subject: { id: string; code: string; name: string };
          academicYear: { year: number };
        }>;
      };
    };
  },
  async actualizarocrearhorario(datos: {
    courseId: string;
    subjectId: string;
    teacherId: string;
    dayOfWeek: string;
    periodIndex: number;
    startTime: string;
    endTime: string;
    classroom?: string;
  }) {
    const respuesta = await clienteapi.post('/schedules/upsert', datos);
    return respuesta.data as { statusCode: number; message: string; data: clasehorarioelemento };
  },
  async generarautomaticohorario(cursoid: string) {
    const respuesta = await clienteapi.post(`/schedules/generate-auto/${cursoid}`);
    return respuesta.data as {
      statusCode: number;
      message: string;
      data: {
        totalSlots: number;
        distribution: Array<{
          subjectName: string;
          code: string;
          teacherName: string;
          periods: number;
        }>;
      };
    };
  },
  async eliminarhorario(id: string) {
    const respuesta = await clienteapi.delete(`/schedules/${id}`);
    return respuesta.data as { statusCode: number; message: string };
  },

  // Comunicados Institucionales
  async listaranuncios() {
    const respuesta = await clienteapi.get('/announcements');
    return respuesta.data as {
      statusCode: number;
      message: string;
      data: anuncioelemento[];
      total: number;
    };
  },
  async crearanuncio(datos: {
    title: string;
    content: string;
    urgency: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
    scope:
      | 'COURSE'
      | 'ALL_COURSES'
      | 'PARENT'
      | 'ALL_PARENTS'
      | 'TEACHER'
      | 'ALL_TEACHERS'
      | 'SPECIFIC_PARENTS'
      | 'SPECIFIC_TEACHERS'
      | 'SPECIFIC_STUDENTS';
    targetCourseId?: string;
    targetParentId?: string;
    targetTeacherId?: string;
    targetUserIds?: string[];
  }) {
    const respuesta = await clienteapi.post('/announcements', datos);
    return respuesta.data as { statusCode: number; message: string; data: anuncioelemento };
  },
  async eliminaranuncio(id: string) {
    const respuesta = await clienteapi.delete(`/announcements/${id}`);
    return respuesta.data as { statusCode: number; message: string };
  },
};

export interface anuncioelemento {
  id: string;
  title: string;
  content: string;
  urgency: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  scope:
    | 'COURSE'
    | 'ALL_COURSES'
    | 'PARENT'
    | 'ALL_PARENTS'
    | 'TEACHER'
    | 'ALL_TEACHERS'
    | 'SPECIFIC_PARENTS'
    | 'SPECIFIC_TEACHERS'
    | 'SPECIFIC_STUDENTS';
  targetCourseId?: string | null;
  targetParentId?: string | null;
  targetTeacherId?: string | null;
  targetUserIds?: string[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: { id: string; firstName: string; lastName: string; role: string; email?: string };
  targetCourse?: { id: string; name: string } | null;
  targetParent?: {
    id: string;
    firstName: string;
    lastName: string;
    ci?: string;
    phone?: string;
  } | null;
  targetTeacher?: { id: string; firstName: string; lastName: string; specialty?: string } | null;
}
