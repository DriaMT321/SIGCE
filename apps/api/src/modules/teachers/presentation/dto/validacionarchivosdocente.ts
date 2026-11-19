import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const maximoarchivobytes = 8 * 1024 * 1024;
const maximoexpedientebytes = 10 * 1024 * 1024;

function leerarchivo(
  valor: unknown,
  soloimagen = false,
): { valido: boolean; bytes: number } {
  if (valor === undefined || valor === null || valor === '') return { valido: true, bytes: 0 };
  if (typeof valor !== 'string') return { valido: false, bytes: 0 };

  const coincidencia = /^data:(application\/pdf|image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(
    valor,
  );
  if (!coincidencia || (soloimagen && coincidencia[1] === 'application/pdf')) {
    return { valido: false, bytes: 0 };
  }
  const bytes = Buffer.from(coincidencia[2], 'base64').byteLength;
  return { valido: bytes > 0 && bytes <= maximoarchivobytes, bytes };
}

function recorreradjuntos(
  valor: unknown,
  profundidad = 0,
): { valido: boolean; bytes: number } {
  if (profundidad > 8 || !valor || typeof valor !== 'object') {
    return { valido: profundidad <= 8, bytes: 0 };
  }
  let bytes = 0;
  for (const [clave, elemento] of Object.entries(valor)) {
    if (clave === 'archivoUrl' || clave === 'fotoPerfil') {
      const archivo = leerarchivo(elemento, clave === 'fotoPerfil');
      if (!archivo.valido) return { valido: false, bytes: 0 };
      bytes += archivo.bytes;
    } else if (elemento && typeof elemento === 'object') {
      const anidado = recorreradjuntos(elemento, profundidad + 1);
      if (!anidado.valido) return { valido: false, bytes: 0 };
      bytes += anidado.bytes;
    }
    if (bytes > maximoexpedientebytes) return { valido: false, bytes: 0 };
  }
  return { valido: true, bytes };
}

@ValidatorConstraint({ name: 'archivoDocenteValido', async: false })
export class ValidadorArchivoDocente implements ValidatorConstraintInterface {
  validate(valor: unknown): boolean {
    return leerarchivo(valor, true).valido;
  }

  defaultMessage(): string {
    return 'La foto del docente debe ser JPG, PNG o WebP y no superar 8 MB.';
  }
}

@ValidatorConstraint({ name: 'documentosDocenteValidos', async: false })
export class ValidadorDocumentosDocente implements ValidatorConstraintInterface {
  validate(valor: unknown): boolean {
    if (valor === undefined || valor === null) return true;
    if (typeof valor !== 'object' || Array.isArray(valor)) return false;
    const requisitos = valor as { rda?: { archivoUrl?: unknown; numeroRda?: unknown } };
    if (
      typeof requisitos.rda?.archivoUrl === 'string' &&
      requisitos.rda.archivoUrl.length > 0 &&
      (typeof requisitos.rda.numeroRda !== 'string' || !requisitos.rda.numeroRda.trim())
    ) {
      return false;
    }
    const resultado = recorreradjuntos(valor);
    return resultado.valido && Buffer.byteLength(JSON.stringify(valor), 'utf8') <= 14 * 1024 * 1024;
  }

  defaultMessage(_argumentos: ValidationArguments): string {
    return 'Adjunta archivos PDF, JPG, PNG o WebP de hasta 8 MB cada uno (10 MB por legajo). Si adjuntas el RDA, completa también su número.';
  }
}
