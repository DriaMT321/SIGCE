import 'reflect-metadata';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';
import { dtofiltroscursos } from './courses/presentation/dto/filtroscursos.dto';
import { dtofiltrosinscripciones } from './enrollments/presentation/dto/filtrosinscripciones.dto';
import { dtofiltrosasistencia } from './attendance/presentation/dto/filtrosasistencia.dto';
import { dtofiltroscalificaciones } from './grades/presentation/dto/filtroscalificaciones.dto';
import { dtofiltroscorreccionescalificacion } from './grades/presentation/dto/filtroscorreccionescalificacion.dto';

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

function validarconsulta<T extends object>(tipo: ClassConstructor<T>, entrada: object) {
  return pipe.transform(entrada, { type: 'query', metatype: tipo }) as Promise<T>;
}

describe('filtros de módulos académicos', () => {
  it('valida los filtros de cursos y normaliza paginación', async () => {
    await expect(
      validarconsulta(dtofiltroscursos, {
        academicYearId: 'c7966a97-4e2c-4e91-9962-b584d01c06f4',
        search: ' Matemática ',
        limit: '100',
        offset: '20',
      }),
    ).resolves.toMatchObject({
      academicYearId: 'c7966a97-4e2c-4e91-9962-b584d01c06f4',
      search: 'Matemática',
      limit: 100,
      offset: 20,
    });
  });

  it('acepta los filtros de inscripciones previstos por el endpoint', async () => {
    await expect(
      validarconsulta(dtofiltrosinscripciones, {
        academicYearId: 'c7966a97-4e2c-4e91-9962-b584d01c06f4',
        courseId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39443',
        studentId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39444',
        limit: '50',
      }),
    ).resolves.toMatchObject({
      courseId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39443',
      studentId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39444',
      limit: 50,
    });
  });

  it('acepta fechas ISO en el filtro de asistencia', async () => {
    await expect(
      validarconsulta(dtofiltrosasistencia, {
        studentId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39444',
        courseId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39443',
        from: '2026-10-01',
        to: '2026-10-31',
      }),
    ).resolves.toMatchObject({ from: '2026-10-01', to: '2026-10-31' });
  });

  it('acepta filtros de calificaciones', async () => {
    await expect(
      validarconsulta(dtofiltroscalificaciones, {
        studentId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39444',
        enrollmentId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39445',
        periodId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39446',
      }),
    ).resolves.toMatchObject({
      studentId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39444',
      enrollmentId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39445',
      periodId: '9c0608b7-4413-4e43-ad2a-3e2a2bc39446',
    });
  });

  it('rechaza filtros de corrección fuera del catálogo', async () => {
    await expect(
      validarconsulta(dtofiltroscorreccionescalificacion, { status: 'UNKNOWN' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rechaza query keys que el endpoint no declara', async () => {
    await expect(
      validarconsulta(dtofiltroscursos, {
        academicYearId: 'c7966a97-4e2c-4e91-9962-b584d01c06f4',
        admin: 'true',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
