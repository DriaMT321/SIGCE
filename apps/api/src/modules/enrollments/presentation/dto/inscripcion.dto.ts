import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { estadoinscripcion } from '@academic/shared-types';

export class dtocrearinscripcion {
  @IsUUID()
  studentId: string;

  @IsUUID()
  courseId: string;

  @IsUUID()
  academicYearId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

export class dtoactualizarinscripcion {
  @IsEnum(estadoinscripcion)
  status: estadoinscripcion;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

export class dtoactualizarestadomasivo {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayMaxSize(1000)
  @IsUUID('4', { each: true })
  ids: string[];

  @IsEnum(estadoinscripcion)
  status: estadoinscripcion;
}
