import { incumplimientoregladominio } from '../violacionregladominio';

export function validarcontrasena(contrasena: string): void {
  const cantidadcaracteres = [...contrasena].length;
  const cantidadbytes = new TextEncoder().encode(contrasena).length;
  if (!/\P{White_Space}/u.test(contrasena) || cantidadcaracteres < 12 || cantidadbytes > 72) {
    throw new incumplimientoregladominio(
      'VALIDATION',
      'La contraseña no puede contener solo espacios, debe tener al menos 12 caracteres y como máximo 72 bytes UTF-8.',
    );
  }
}
