import { diadelasemana, type codigodiadelasemana } from '@academic/shared-types';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
  Validate,
  ValidatorConstraint,
  type ValidationArguments,
  type ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'scheduleEndAfterStart', async: false })
class horariofinafterinicio implements ValidatorConstraintInterface {
  validate(finhora: string, args: ValidationArguments): boolean {
    const horario = args.object as dtoescriturahorario;
    if (typeof finhora !== 'string' || typeof horario.startTime !== 'string') return true;
    return aminutes(finhora) > aminutes(horario.startTime);
  }

  defaultmensaje(): string {
    return 'La hora de finalización debe ser posterior a la hora de inicio';
  }
}

export class dtoescriturahorario {
  @IsUUID()
  courseId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  teacherId: string;

  @IsOptional()
  @IsUUID()
  academicYearId?: string;

  @IsIn(Object.values(diadelasemana))
  dayOfWeek: codigodiadelasemana;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  @Validate(horariofinafterinicio)
  endTime: string;

  @IsInt()
  @Min(1)
  @Max(6)
  periodIndex: number;

  @IsOptional()
  @IsString()
  classroom?: string;
}

function aminutes(valor: string): number {
  const [hours, minutes] = valor.split(':').map(Number);
  return hours * 60 + minutes;
}
