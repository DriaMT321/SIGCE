import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { dtocrearcalificacionesmasivas } from './calificacion.dto';

describe('dtocrearcalificacionesmasivas', () => {
  it('rejects a batch larger than the maximum course capacity', () => {
    const dto = plainToInstance(dtocrearcalificacionesmasivas, {
      courseId: 'c7966a97-4e2c-4e91-9962-b584d01c06f4',
      subjectId: 'c7966a97-4e2c-4e91-9962-b584d01c06f4',
      periodId: 'c7966a97-4e2c-4e91-9962-b584d01c06f4',
      grades: Array.from({ length: 101 }, () => ({
        studentId: 'c7966a97-4e2c-4e91-9962-b584d01c06f4',
        enrollmentId: 'c7966a97-4e2c-4e91-9962-b584d01c06f4',
        value: 80,
      })),
    });

    expect(validateSync(dto).map((error) => error.property)).toContain('grades');
  });
});
