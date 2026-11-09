import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, Validate } from 'class-validator';
import { genero, tiporelacion } from '@academic/shared-types';
import { dtopaginacion } from '../../../../common/dto/paginacion.dto';
import { validacionfechanacimientoestudiante } from '../validators/fechanacimientoestudiante.validator';

export class dtofiltrosestudiante extends dtopaginacion {
  @IsOptional()
  @IsString()
  courseId?: string;
}

export class dtocrearestudiante {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @MaxLength(40)
  rude: string;

  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @MaxLength(30)
  ci: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(80)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(80)
  lastName: string;

  @IsString({ message: 'La fecha de nacimiento debe ser texto con formato AAAA-MM-DD.' })
  @Validate(validacionfechanacimientoestudiante)
  birthDate: string;

  @IsEnum(genero)
  gender: genero;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsEnum(tiporelacion)
  relationship?: tiporelacion;
}

export class dtoactualizarestudiante {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(40)
  rude?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(30)
  ci?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @MaxLength(80)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @MaxLength(80)
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'La fecha de nacimiento debe ser texto con formato AAAA-MM-DD.' })
  @Validate(validacionfechanacimientoestudiante)
  birthDate?: string;

  @IsOptional()
  @IsEnum(genero)
  gender?: genero;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsEnum(tiporelacion)
  relationship?: tiporelacion;
}

export class dtobuscarcoincidenciasestudiante {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  rude?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  ci?: string;
}
