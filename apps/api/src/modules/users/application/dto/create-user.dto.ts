import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@academic/shared-types';

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El nombre es obligatorio' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  firstName: string;

  @IsString({ message: 'El apellido es obligatorio' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  lastName: string;

  @IsEnum(UserRole, { message: 'Rol de usuario no válido' })
  role: UserRole;

  @IsOptional()
  @IsString()
  ci?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  itemNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  occupation?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  isActive?: boolean;
}
