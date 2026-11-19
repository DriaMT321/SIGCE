import { Transform } from 'class-transformer';
import {
  IsByteLength,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { ValidadorArchivoDocente, ValidadorDocumentosDocente } from './validacionarchivosdocente';

export class dtocreardocente {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12, { message: 'La contraseña debe tener al menos 12 caracteres' })
  @IsByteLength(0, 72, { message: 'La contraseña no puede exceder 72 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
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

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(100)
  specialty: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  itemNumber?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(50)
  rdaNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  escalafonCategory?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfService?: number;

  @IsOptional()
  @IsString()
  @Validate(ValidadorArchivoDocente)
  photoUrl?: string;

  @IsOptional()
  @Validate(ValidadorDocumentosDocente)
  documents?: any;
}

export class dtoactualizardocente {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
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
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @MaxLength(100)
  specialty?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  itemNumber?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(50)
  rdaNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  escalafonCategory?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfService?: number;

  @IsOptional()
  @IsString()
  @Validate(ValidadorArchivoDocente)
  photoUrl?: string;

  @IsOptional()
  @Validate(ValidadorDocumentosDocente)
  documents?: any;
}
