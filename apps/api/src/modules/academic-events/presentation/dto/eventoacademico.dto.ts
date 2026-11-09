import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AcademicEventStatus, AcademicEventType } from '@prisma/client';

export class dtocreareventoacademico {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres.' })
  @MaxLength(120, { message: 'El título admite hasta 120 caracteres.' })
  title: string;

  @IsEnum(AcademicEventType)
  type: AcademicEventType;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'La descripción admite hasta 2000 caracteres.' })
  description?: string;

  @IsDateString({ strict: true, strictSeparator: true }, { message: 'La fecha de inicio no es válida.' })
  startsAt: string;

  @IsDateString({ strict: true, strictSeparator: true }, { message: 'La fecha de finalización no es válida.' })
  endsAt: string;

  @IsBoolean()
  allDay: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'El lugar admite hasta 160 caracteres.' })
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  targetCourseId?: string | null;
}

export class dtoactualizareventoacademico {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres.' })
  @MaxLength(120, { message: 'El título admite hasta 120 caracteres.' })
  title?: string;

  @IsOptional()
  @IsEnum(AcademicEventType)
  type?: AcademicEventType;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'La descripción admite hasta 2000 caracteres.' })
  description?: string | null;

  @IsOptional()
  @IsDateString({ strict: true, strictSeparator: true }, { message: 'La fecha de inicio no es válida.' })
  startsAt?: string;

  @IsOptional()
  @IsDateString({ strict: true, strictSeparator: true }, { message: 'La fecha de finalización no es válida.' })
  endsAt?: string;

  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'El lugar admite hasta 160 caracteres.' })
  location?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  targetCourseId?: string | null;

  @IsOptional()
  @IsEnum(AcademicEventStatus)
  status?: AcademicEventStatus;
}

