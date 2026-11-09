import 'reflect-metadata';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';
import { dtofiltrosalertas } from './alerts/presentation/dto/filtrosalertas.dto';
import { dtofiltrosauditoria } from './audit/presentation/dto/filtrosauditoria.dto';
import { seleccionasistentesieDto } from './sie-sync/presentation/dto/sie-asistente.dto';

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

function validarconsulta<T extends object>(tipo: ClassConstructor<T>, entrada: object) {
  return pipe.transform(entrada, { type: 'query', metatype: tipo }) as Promise<T>;
}

describe('filtros operativos', () => {
  it('valida estado y límites de alertas', async () => {
    await expect(
      validarconsulta(dtofiltrosalertas, { status: 'OPEN', limit: '100', offset: '0' }),
    ).resolves.toMatchObject({ status: 'OPEN', limit: 100, offset: 0 });
    await expect(validarconsulta(dtofiltrosalertas, { status: 'UNKNOWN' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('valida filtros y topes de auditoría', async () => {
    await expect(
      validarconsulta(dtofiltrosauditoria, {
        entity: 'Attendance',
        correlationId: 'corr-123',
        limit: '100',
        offset: '50',
      }),
    ).resolves.toMatchObject({ entity: 'Attendance', correlationId: 'corr-123', limit: 100 });
    await expect(validarconsulta(dtofiltrosauditoria, { offset: '-1' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('exige gestión, curso, materia y trimestre para preparar notas', async () => {
    const seleccion = {
      academicYearId: 'e948fd99-3452-41f9-9a62-ae29330dc609',
      courseId: '0ab3d6d6-9b1c-4e1f-9117-707e40f0b3f8',
      subjectId: '700c5b9e-77a6-4291-9d57-4aa0ba95ed1e',
      periodNumber: '2',
    };
    await expect(
      validarconsulta(seleccionasistentesieDto, seleccion),
    ).resolves.toMatchObject({
      academicYearId: seleccion.academicYearId,
      courseId: seleccion.courseId,
      subjectId: seleccion.subjectId,
      periodNumber: 2,
    });
    await expect(validarconsulta(seleccionasistentesieDto, { ...seleccion, periodNumber: '4' })).rejects.toThrow(BadRequestException);
    await expect(validarconsulta(seleccionasistentesieDto, { ...seleccion, courseId: 'otro' })).rejects.toThrow(BadRequestException);
    await expect(validarconsulta(seleccionasistentesieDto, { ...seleccion, search: 'curso' })).rejects.toThrow(BadRequestException);
    await expect(validarconsulta(dtofiltrosalertas, { search: 'alerta' })).rejects.toThrow(
      BadRequestException,
    );
    await expect(validarconsulta(dtofiltrosauditoria, { search: 'auditoria' })).rejects.toThrow(
      BadRequestException,
    );
  });
});
