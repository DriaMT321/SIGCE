import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  alcanceanuncio,
  urgenciaanuncio,
  estadoplanestudio,
  diadelasemana,
} from '@academic/shared-types';
import { dtocrearanuncio } from './announcements/presentation/dto/crearanuncio.dto';
import { dtoactivarcuentaestudiante } from './auth/presentation/dto/acceso.dto';
import { dtoactualizarestadoalerta } from './alerts/presentation/dto/actualizaralertaestado.dto';
import { dtocreartemacurricular } from './curriculum/presentation/dto/creartemacurriculo.dto';
import { dtoactualizaravancecurricular } from './curriculum/presentation/dto/actualizarcurriculoprogreso.dto';
import { dtoescriturahorario } from './schedules/presentation/dto/escriturahorario.dto';
import { dtoactualizardocente } from './teachers/presentation/dto/docente.dto';
import { dtoactualizarfamiliar } from './parents/presentation/dto/padre.dto';
import {
  dtoactualizarestudiante,
  dtocrearestudiante,
} from './students/presentation/dto/estudiante.dto';
import { dtoactualizarusuario, dtocrearusuario } from './users/presentation/dto/crearusuario.dto';

describe('request DTO validation', () => {
  it('trims profile fields and rejects whitespace-only values', async () => {
    const dto = plainToInstance(dtoactivarcuentaestudiante, {
      activationToken: 'a'.repeat(32),
      newPassword: ' '.repeat(12),
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('trims and rejects blank teacher and family names on PATCH', async () => {
    const nombrevacio = plainToInstance(dtoactualizardocente, { firstName: '   ' });
    const nombrevalido = plainToInstance(dtoactualizarfamiliar, { lastName: '  Paz  ' });
    const documentovacio = plainToInstance(dtoactualizardocente, { ci: '   ' });
    const especialidadvacia = plainToInstance(dtoactualizardocente, { specialty: '   ' });
    const telefonovacio = plainToInstance(dtoactualizarfamiliar, { phone: '   ' });
    const nombreusuariovacio = plainToInstance(dtoactualizarusuario, { lastName: '   ' });
    const nombreestudiantevacio = plainToInstance(dtoactualizarestudiante, { firstName: '   ' });
    const claveactivacionvacia = plainToInstance(dtoactivarcuentaestudiante, {
      activationToken: 'a'.repeat(32),
      newPassword: ' '.repeat(12),
    });
    const clavenormalizadaincorrectamente = plainToInstance(dtoactivarcuentaestudiante, {
      activationToken: 'a'.repeat(32),
      newPassword: '\u0085'.repeat(12),
    });
    const usuarioalcrear = plainToInstance(dtocrearusuario, { firstName: '  Ana  ' });
    const estudiantealcrear = plainToInstance(dtocrearestudiante, { lastName: '  Paz  ' });

    expect(nombrevacio.firstName).toBe('');
    expect(await validate(nombrevacio)).not.toHaveLength(0);
    expect(nombrevalido.lastName).toBe('Paz');
    expect(await validate(nombrevalido)).toHaveLength(0);
    expect(await validate(documentovacio)).not.toHaveLength(0);
    expect(await validate(especialidadvacia)).not.toHaveLength(0);
    expect(await validate(telefonovacio)).not.toHaveLength(0);
    expect(await validate(nombreusuariovacio)).not.toHaveLength(0);
    expect(await validate(nombreestudiantevacio)).not.toHaveLength(0);
    expect(await validate(claveactivacionvacia)).not.toHaveLength(0);
    expect(await validate(clavenormalizadaincorrectamente)).not.toHaveLength(0);
    expect(usuarioalcrear.firstName).toBe('Ana');
    expect(estudiantealcrear.lastName).toBe('Paz');
  });

  it('requires a status from the alert workflow', async () => {
    const invalid = Object.assign(new dtoactualizarestadoalerta(), { status: 'CLOSED' });
    const valid = Object.assign(new dtoactualizarestadoalerta(), { status: 'RESOLVED' });

    expect(await validate(invalid)).toHaveLength(1);
    expect(await validate(valid)).toHaveLength(0);
  });

  it('requires the recipient fields that match an announcement scope', async () => {
    const missingCourse = Object.assign(new dtocrearanuncio(), {
      title: 'Reunión',
      content: 'Reunión informativa',
      urgency: urgenciaanuncio.MEDIA,
      scope: alcanceanuncio.COURSE,
    });
    const validCourse = Object.assign(new dtocrearanuncio(), {
      ...missingCourse,
      targetCourseId: '11111111-1111-4111-8111-111111111111',
    });

    expect(await validate(missingCourse)).not.toHaveLength(0);
    expect(await validate(validCourse)).toHaveLength(0);
  });

  it('enforces curriculum status and progress boundaries', async () => {
    const invalid = Object.assign(new dtoactualizaravancecurricular(), {
      status: 'DONE',
      progressPercent: 101,
    });
    const valid = Object.assign(new dtoactualizaravancecurricular(), {
      status: estadoplanestudio.COMPLETADO,
      progressPercent: 100,
    });

    expect(await validate(invalid)).toHaveLength(2);
    expect(await validate(valid)).toHaveLength(0);
  });

  it('enforces curriculum period and identifier boundaries', async () => {
    const invalid = Object.assign(new dtocreartemacurricular(), {
      subjectId: 'not-a-uuid',
      periodNumber: 4,
      unitTitle: 'Unidad',
      title: 'Contenido',
    });
    const valid = Object.assign(new dtocreartemacurricular(), {
      subjectId: '11111111-1111-4111-8111-111111111111',
      periodNumber: 3,
      unitTitle: 'Unidad',
      title: 'Contenido',
    });

    expect(await validate(invalid)).not.toHaveLength(0);
    expect(await validate(valid)).toHaveLength(0);
  });

  it('rejects impossible schedule time ranges and periods', async () => {
    const invalid = Object.assign(new dtoescriturahorario(), {
      courseId: '11111111-1111-4111-8111-111111111111',
      subjectId: '22222222-2222-4222-8222-222222222222',
      teacherId: '33333333-3333-4333-8333-333333333333',
      dayOfWeek: diadelasemana.LUNES,
      startTime: '10:00',
      endTime: '09:45',
      periodIndex: 7,
    });
    const valid = Object.assign(new dtoescriturahorario(), {
      ...invalid,
      startTime: '09:00',
      endTime: '09:45',
      periodIndex: 6,
    });

    expect(await validate(invalid)).toHaveLength(2);
    expect(await validate(valid)).toHaveLength(0);
  });
});
