import { Transform } from 'class-transformer';
import { roliniciosesion } from '../../application/dto/acceso.dto';
import {
  IsByteLength,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class dtoiniciosesion {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsByteLength(1, 72, { message: 'La contraseña no puede exceder 72 bytes UTF-8' })
  password: string;
}

export class dtotokenrenovacion {
  @IsString()
  @IsNotEmpty({ message: 'El refresh token es requerido' })
  refreshToken: string;
}

export class dtoiniciosesionporrol {
  @IsEnum(roliniciosesion)
  role: roliniciosesion;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsOptional()
  @Transform(({ value: valor }) =>
    typeof valor === 'string' && valor.trim() === '' ? undefined : valor,
  )
  @IsString()
  @MinLength(6)
  @IsByteLength(1, 72)
  secret?: string;

  @IsOptional()
  @Transform(({ value: valor }) =>
    typeof valor === 'string' && valor.trim() === '' ? undefined : valor,
  )
  @IsString()
  @IsNotEmpty()
  secondaryIdentifier?: string;
}

export class dtoactivarcuentaestudiante {
  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  @MaxLength(100)
  activationToken: string;

  @IsString()
  @Matches(/\P{White_Space}/u, { message: 'La nueva clave no puede contener solo espacios' })
  @MinLength(12, { message: 'La nueva clave debe tener al menos 12 caracteres' })
  @IsByteLength(12, 72, { message: 'La nueva clave debe tener entre 12 y 72 bytes UTF-8' })
  newPassword: string;
}
