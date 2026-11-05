import { IsByteLength, IsString, MinLength } from 'class-validator';

export class dtorestablecercontrasenausuario {
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(12, { message: 'La contraseña debe tener al menos 12 caracteres' })
  @IsByteLength(0, 72, { message: 'La contraseña no puede exceder 72 caracteres' })
  newPassword: string;
}
