import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export enum LoginRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  FAMILY = 'FAMILY',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
}

export class LoginDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'El refresh token es requerido' })
  refreshToken: string;
}

export class RoleLoginDto {
  @IsEnum(LoginRole)
  role: LoginRole;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  secret?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  secondaryIdentifier?: string;
}
