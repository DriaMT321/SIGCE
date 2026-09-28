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

export type Student = z.infer<typeof studentSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;
export type Grade = z.infer<typeof gradeSchema>;
export type Attendance = z.infer<typeof attendanceSchema>;
export type Teacher = z.infer<typeof teacherSchema>;
export type Parent = z.infer<typeof parentSchema>;
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
  async listParents(search?: string) {
    const response = await apiClient.get('/parents', { params: { search, limit: 100 } });
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
  async listAlerts() {
    const response = await apiClient.get('/alerts', { params: { limit: 100 } });
    return z.object({ data: z.array(z.object({ id: z.string(), title: z.string(), message: z.string(), severity: z.string(), isRead: z.boolean(), createdAt: z.string() })), total: z.number() }).parse(response.data);
  },
  async markAlertRead(id: string) {
    const response = await apiClient.patch(`/alerts/${id}/read`);
    return z.object({ data: z.object({ id: z.string(), isRead: z.boolean() }) }).parse(response.data).data;
  },
  async listAudit() {
    const response = await apiClient.get('/audit', { params: { limit: 100 } });
    return z.object({ data: z.array(z.object({ id: z.string(), action: z.string(), entity: z.string(), entityId: z.string(), userId: z.string().nullable(), previousValue: z.unknown().nullable(), newValue: z.unknown().nullable(), createdAt: z.string() })), total: z.number() }).parse(response.data);
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
  async getCourseSchedule(courseId: string) {
    const response = await apiClient.get(`/schedules/course/${courseId}`);
    return response.data as { statusCode: number; data: { course: Course; schedules: ClassScheduleItem[]; teacherSubjects: any[] } };
  },
  async getTeacherSchedule(teacherId: string) {
    const response = await apiClient.get(`/schedules/teacher/${teacherId}`);
    return response.data as { statusCode: number; data: { teacher: Teacher; schedules: ClassScheduleItem[]; assignments: any[] } };
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
};
