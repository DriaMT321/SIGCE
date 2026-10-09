import { z } from 'zod';
import { apiClient } from './api-client';
import { sieSyncListResponseSchema, sieSynchronizationSchema } from '../features/sie-sync/schemas/sie-sync.schema';

const studentSchema = z.object({
  id: z.string(),
  rude: z.string(),
  ci: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.string(),
  gender: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  enrollments: z.array(z.object({
    id: z.string(),
    status: z.string(),
    course: z.object({ id: z.string(), name: z.string(), gradeLevel: z.number(), section: z.string() }),
    academicYear: z.object({ id: z.string(), year: z.number(), name: z.string() }),
  })),
  parents: z.array(z.object({
    id: z.string(),
    relationship: z.string(),
    isPrimary: z.boolean().optional(),
    canPickup: z.boolean().optional(),
    parent: z.object({
      id: z.string(),
      ci: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string().nullable().optional(),
    }),
  })).optional(),
});

const courseSchema = z.object({
  id: z.string(),
  academicYearId: z.string(),
  name: z.string(),
  gradeLevel: z.number(),
  section: z.string(),
  shift: z.string(),
  maxCapacity: z.number(),
  academicYear: z.object({ id: z.string(), year: z.number(), name: z.string() }),
  enrollmentCount: z.number(),
});

const enrollmentSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  academicYearId: z.string(),
  enrollmentDate: z.string(),
  status: z.string(),
  remarks: z.string().nullable(),
  student: z.object({ id: z.string(), rude: z.string(), firstName: z.string(), lastName: z.string() }),
  course: z.object({ id: z.string(), name: z.string(), gradeLevel: z.number(), section: z.string() }),
  academicYear: z.object({ id: z.string(), year: z.number(), name: z.string() }),
});

const gradeSchema = z.object({
  id: z.string(),
  enrollmentId: z.string(),
  studentId: z.string(),
  subjectId: z.string(),
  periodId: z.string(),
  value: z.number(),
  remarks: z.string().nullable(),
  updatedAt: z.string(),
  student: z.object({ id: z.string(), rude: z.string(), firstName: z.string(), lastName: z.string() }),
  subject: z.object({ id: z.string(), code: z.string(), name: z.string() }),
  period: z.object({ id: z.string(), name: z.string(), number: z.number() }),
});

const attendanceSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  registeredById: z.string(),
  date: z.string(),
  status: z.string(),
  justification: z.string().nullable(),
  student: z.object({ id: z.string(), rude: z.string(), firstName: z.string(), lastName: z.string() }),
  course: z.object({ id: z.string(), name: z.string(), gradeLevel: z.number(), section: z.string() }),
});

const teacherSchema = z.object({
  id: z.string(),
  userId: z.string(),
  ci: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  specialty: z.string(),
  phone: z.string().nullable(),
  itemNumber: z.string().nullable(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const parentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  ci: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  occupation: z.string().nullable(),
  students: z.array(z.object({ id: z.string(), rude: z.string(), firstName: z.string(), lastName: z.string() })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const listResponse = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({ statusCode: z.number(), message: z.string(), data: z.array(itemSchema), total: z.number() });
const dataResponse = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({ statusCode: z.number(), message: z.string(), data: itemSchema });

const assignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['TAREA', 'EXAMEN', 'TRABAJO_PRACTICO', 'PROYECTO', 'CONTROL_LECTURA']),
  description: z.string().nullable().optional(),
  dueDate: z.string(),
  maxScore: z.number().nullable().optional(),
  status: z.enum(['PENDIENTE', 'EN_PROGRESO', 'FINALIZADO', 'CANCELADO']),
  courseId: z.string(),
  subjectId: z.string(),
  teacherId: z.string(),
  course: z.object({ id: z.string(), name: z.string(), gradeLevel: z.number(), section: z.string() }).optional(),
  subject: z.object({ id: z.string(), code: z.string(), name: z.string() }).optional(),
  teacher: z.object({ id: z.string(), firstName: z.string(), lastName: z.string() }).optional(),
  student: z.object({ id: z.string(), firstName: z.string(), lastName: z.string() }).optional(),
  createdAt: z.string().optional(),
});

export type Student = z.infer<typeof studentSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;
export type Grade = z.infer<typeof gradeSchema>;
export type Attendance = z.infer<typeof attendanceSchema>;
export type Teacher = z.infer<typeof teacherSchema>;
export type Parent = z.infer<typeof parentSchema>;
export type Assignment = z.infer<typeof assignmentSchema>;
export type AcademicYear = { id: string; year: number; name: string; isActive: boolean; isClosed: boolean };
export type Period = { id: string; name: string; number: number; academicYearId: string; isClosed: boolean };
export type Subject = { id: string; code: string; name: string };

const academicYearSchema = z.object({ id: z.string(), year: z.number(), name: z.string(), isActive: z.boolean(), isClosed: z.boolean() });
const periodSchema = z.object({ id: z.string(), name: z.string(), number: z.number(), academicYearId: z.string(), isClosed: z.boolean() });
const subjectSchema = z.object({ id: z.string(), code: z.string(), name: z.string() });

export interface ClassScheduleItem {
  id: string;
  courseId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';
  startTime: string;
  endTime: string;
  periodIndex: number;
  classroom?: string | null;
  course?: { id: string; name: string; gradeLevel: number; section: string };
  subject?: { id: string; code: string; name: string; area?: string | null };
  teacher?: { id: string; firstName: string; lastName: string; specialty: string };
}

export interface CurriculumTopicItem {
  id: string;
  subjectId: string;
  courseId?: string | null;
  periodNumber: number;
  gradeLevel: number;
  campo: string;
  unitTitle: string;
  title: string;
  description?: string | null;
  progressPercent: number;
  status: 'PLANIFICADO' | 'EN_DESARROLLO' | 'COMPLETADO';
  subject?: { id: string; code: string; name: string; area?: string | null };
  course?: { id: string; name: string } | null;
}

export interface MyScheduleChildItem {
  student: { id: string; firstName: string; lastName: string; rude: string; ci: string };
  relationship?: string;
  course: Course | null;
  schedules: ClassScheduleItem[];
  teacherSubjects: Record<string, unknown>[];
}

export interface MyScheduleData {
  type: 'student' | 'parent' | 'teacher' | 'administrative';
  student?: { id: string; firstName: string; lastName: string; rude: string; ci: string };
  parent?: { id: string; firstName: string; lastName: string; ci: string };
  children?: MyScheduleChildItem[];
  course?: Course | null;
  schedules: ClassScheduleItem[];
  teacherSubjects?: Record<string, unknown>[];
  teacher?: Teacher;
  assignments?: Record<string, unknown>[];
  message?: string;
}

export const academicApi = {
  async listStudents(search?: string, limit = 1000, offset = 0) {
    const response = await apiClient.get('/students', { params: { search, limit, offset } });
    return listResponse(studentSchema).parse(response.data);
  },
  async createStudent(data: unknown) {
    const response = await apiClient.post('/students', data);
    return dataResponse(studentSchema).parse(response.data).data;
  },
  async listCourses(search?: string) {
    const response = await apiClient.get('/courses', { params: { search, limit: 100 } });
    return listResponse(courseSchema).parse(response.data);
  },
  async createCourse(data: unknown) {
    const response = await apiClient.post('/courses', data);
    return dataResponse(courseSchema).parse(response.data).data;
  },
  async listTeachers(search?: string) {
    const response = await apiClient.get('/teachers', { params: { search, limit: 100 } });
    return listResponse(teacherSchema).parse(response.data);
  },
  async createTeacher(data: unknown) {
    const response = await apiClient.post('/teachers', data);
    return dataResponse(teacherSchema).parse(response.data).data;
  },
  async listParents(search?: string, limit = 100, offset = 0) {
    const response = await apiClient.get('/parents', { params: { search, limit, offset } });
    return listResponse(parentSchema).parse(response.data);
  },
  async createParent(data: unknown) {
    const response = await apiClient.post('/parents', data);
    return dataResponse(parentSchema).parse(response.data).data;
  },
  async listAcademicYears() {
    const response = await apiClient.get('/academic-years');
    return z.object({ data: z.array(academicYearSchema) }).parse(response.data).data;
  },
  async listPeriods(academicYearId?: string) {
    const response = await apiClient.get('/periods', { params: { academicYearId } });
    return z.object({ data: z.array(periodSchema) }).parse(response.data).data;
  },
  async updatePeriod(id: string, data: { name?: string; isClosed?: boolean; startDate?: string; endDate?: string }) {
    const response = await apiClient.patch(`/periods/${id}`, data);
    return response.data as { statusCode: number; message: string; data: Period };
  },
  async listSubjects(search?: string) {
    const response = await apiClient.get('/subjects', { params: { search } });
    return z.object({ data: z.array(subjectSchema) }).parse(response.data).data;
  },
  async listEnrollments(studentId?: string) {
    const response = await apiClient.get('/enrollments', { params: { studentId, limit: 100 } });
    return listResponse(enrollmentSchema).parse(response.data);
  },
  async createEnrollment(data: unknown) {
    const response = await apiClient.post('/enrollments', data);
    return dataResponse(enrollmentSchema).parse(response.data).data;
  },
  async updateEnrollment(id: string, data: unknown) {
    const response = await apiClient.patch(`/enrollments/${id}`, data);
    return dataResponse(enrollmentSchema).parse(response.data).data;
  },
  async listGrades(params?: { studentId?: string; periodId?: string }) {
    const response = await apiClient.get('/grades', { params: { ...params, limit: 200 } });
    return listResponse(gradeSchema).parse(response.data);
  },
  async createGrade(data: unknown) {
    const response = await apiClient.post('/grades', data);
    return dataResponse(gradeSchema).parse(response.data).data;
  },
  async createBulkGrades(data: {
    courseId: string;
    subjectId: string;
    periodId: string;
    grades: Array<{ studentId: string; enrollmentId: string; value: number; remarks?: string }>;
    reason?: string;
  }) {
    const response = await apiClient.post('/grades/bulk', data);
    return response.data as { statusCode: number; message: string; data: { count: number; items: Grade[] } };
  },
  async updateGrade(id: string, data: unknown) {
    const response = await apiClient.patch(`/grades/${id}`, data);
    return dataResponse(gradeSchema).parse(response.data).data;
  },
  async listAttendance(params?: { studentId?: string; from?: string; to?: string }) {
    const response = await apiClient.get('/attendance', { params: { ...params, limit: 200 } });
    return listResponse(attendanceSchema).parse(response.data);
  },
  async createAttendance(data: unknown) {
    const response = await apiClient.post('/attendance', data);
    return dataResponse(attendanceSchema).parse(response.data).data;
  },
  async listAlerts(params?: { status?: string }) {
    const response = await apiClient.get('/alerts', { params: { limit: 100, ...params } });
    return z.object({
      data: z.array(z.object({
        id: z.string(),
        title: z.string(),
        message: z.string(),
        severity: z.string(),
        status: z.string().optional(),
        isRead: z.boolean(),
        createdAt: z.string(),
      })),
      total: z.number(),
    }).parse(response.data);
  },
  async markAlertRead(id: string) {
    const response = await apiClient.patch(`/alerts/${id}/read`);
    return z.object({ data: z.object({ id: z.string(), isRead: z.boolean() }) }).parse(response.data).data;
  },
  async updateAlertStatus(id: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') {
    const response = await apiClient.patch(`/alerts/${id}/status`, { status });
    return z.object({ data: z.object({ id: z.string(), status: z.string() }) }).parse(response.data).data;
  },
  async listAudit(params?: { correlationId?: string; entity?: string }) {
    const response = await apiClient.get('/audit', { params: { limit: 100, ...params } });
    return z.object({
      data: z.array(z.object({
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
      })),
      total: z.number(),
    }).parse(response.data);
  },
  async listSieSynchronizations() {
    const response = await apiClient.get('/sie-sync', { params: { limit: 20 } });
    return sieSyncListResponseSchema.parse(response.data);
  },
  async getSieSynchronization(id: string) {
    const response = await apiClient.get(`/sie-sync/status/${id}`);
    return sieSynchronizationSchema.parse(response.data.data);
  },

  // Horarios de Clases
  async listSchedules(params?: { courseId?: string; teacherId?: string; dayOfWeek?: string }) {
    const response = await apiClient.get('/schedules', { params });
    return response.data as { statusCode: number; data: ClassScheduleItem[]; total: number };
  },
  async getMySchedule() {
    const response = await apiClient.get('/schedules/my-schedule');
    return response.data as { statusCode: number; message: string; data: MyScheduleData };
  },
  async getCourseSchedule(courseId: string) {
    const response = await apiClient.get(`/schedules/course/${courseId}`);
    return response.data as { statusCode: number; data: { course: Course; schedules: ClassScheduleItem[]; teacherSubjects: Record<string, unknown>[] } };
  },
  async getTeacherSchedule(teacherId: string) {
    const response = await apiClient.get(`/schedules/teacher/${teacherId}`);
    return response.data as { statusCode: number; data: { teacher: Teacher; schedules: ClassScheduleItem[]; assignments: Record<string, unknown>[] } };
  },

  // Avance Curricular
  async listCurriculum(params?: { courseId?: string; gradeLevel?: number; subjectId?: string; periodNumber?: number; status?: string; search?: string }) {
    const response = await apiClient.get('/curriculum', { params });
    return response.data as { statusCode: number; data: CurriculumTopicItem[]; total: number };
  },
  async getCurriculumStats() {
    const response = await apiClient.get('/curriculum/stats');
    return response.data as {
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
  async updateCurriculumProgress(id: string, data: { status?: string; progressPercent?: number }) {
    const response = await apiClient.patch(`/curriculum/${id}/progress`, data);
    return response.data as { statusCode: number; data: CurriculumTopicItem };
  },

  // Gestión de Usuarios Institucionales
  async listUsers(params?: { role?: string; search?: string; limit?: number; offset?: number }) {
    const response = await apiClient.get('/users', { params });
    return response.data as { statusCode: number; message: string; data: Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'ADMIN' | 'DIRECTOR' | 'SECRETARY' | 'TEACHER' | 'PARENT';
      isActive: boolean;
      createdAt: string;
      updatedAt?: string;
    }>; total: number };
  },
  async createUser(data: unknown) {
    const response = await apiClient.post('/users', data);
    return response.data as { statusCode: number; message: string; data: Record<string, unknown> };
  },
  async updateUser(id: string, data: unknown) {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data as { statusCode: number; message: string; data: Record<string, unknown> };
  },

  // Tareas y Exámenes (Assignments)
  async listAssignments(params?: {
    courseId?: string;
    subjectId?: string;
    teacherId?: string;
    type?: string;
    status?: string;
    search?: string;
  }) {
    const response = await apiClient.get('/assignments', { params });
    return listResponse(assignmentSchema).parse(response.data);
  },
  async createAssignment(data: unknown) {
    const response = await apiClient.post('/assignments', data);
    return dataResponse(assignmentSchema).parse(response.data).data;
  },
  async updateAssignment(id: string, data: unknown) {
    const response = await apiClient.patch(`/assignments/${id}`, data);
    return dataResponse(assignmentSchema).parse(response.data).data;
  },
  async deleteAssignment(id: string) {
    const response = await apiClient.delete(`/assignments/${id}`);
    return response.data as { statusCode: number; message: string };
  },
};

