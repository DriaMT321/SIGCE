import { Prisma } from '@prisma/client';
export const sincronizacioncalificacioninclude = {
  student: { select: { rude: true } },
  subject: { select: { code: true, name: true } },
  period: {
    select: {
      number: true,
      isClosed: true,
      academicYear: { select: { year: true, isActive: true } },
    },
  },
  enrollment: {
    select: {
      status: true,
      course: { select: { id: true, name: true, gradeLevel: true, section: true, shift: true } },
    },
  },
} satisfies Prisma.GradeInclude;

export type sincronizacioncalificacion = Prisma.GradeGetPayload<{
  include: typeof sincronizacioncalificacioninclude;
}>;
