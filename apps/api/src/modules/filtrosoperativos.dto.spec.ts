import 'reflect-metadata';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';
import { dtofiltrosalertas } from './alerts/presentation/dto/filtrosalertas.dto';
import { dtofiltrosauditoria } from './audit/presentation/dto/filtrosauditoria.dto';
import { dtofiltrossincronizacionsie } from './sie-sync/presentation/dto/filtrossincronizacionsie.dto';

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

  it('transforma y valida filtros de sincronización SIE', async () => {
    await expect(
      validarconsulta(dtofiltrossincronizacionsie, {
        academicYear: '2026',
        periodNumber: '2',
        courseName: '  Primero A  ',
        status: 'PENDING',
        limit: '20',
      }),
    ).resolves.toMatchObject({
      academicYear: 2026,
      periodNumber: 2,
      courseName: 'Primero A',
      status: 'PENDING',
      limit: 20,
    });
    await expect(
      validarconsulta(dtofiltrossincronizacionsie, { academicYear: '2026.5' }),
    ).rejects.toThrow(BadRequestException);
    await expect(
      validarconsulta(dtofiltrossincronizacionsie, { academicYear: '10000' }),
    ).rejects.toThrow(BadRequestException);
    await expect(
      validarconsulta(dtofiltrossincronizacionsie, { academicYear: '9999' }),
    ).resolves.toMatchObject({ academicYear: 9999 });
    await expect(validarconsulta(dtofiltrossincronizacionsie, { search: 'curso' })).rejects.toThrow(
      BadRequestException,
    );
    await expect(validarconsulta(dtofiltrosalertas, { search: 'alerta' })).rejects.toThrow(
      BadRequestException,
    );
    await expect(validarconsulta(dtofiltrosauditoria, { search: 'auditoria' })).rejects.toThrow(
      BadRequestException,
    );
  });
});
