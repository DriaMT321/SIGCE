import { createHash, randomBytes } from 'node:crypto';
import * as bcrypt from 'bcryptjs';

export type generoimportado = 'MALE' | 'FEMALE' | 'UNSPECIFIED';
export type estadoinscripcionimportado =
  'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED' | 'WITHDRAWN';

function normalizartexto(valor: unknown): string {
  return typeof valor === 'string'
    ? valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase()
    : '';
}

export function generarcorreodocentedemo(nombres: string, apellidos: string, ci: string): string {
  const normalizarslug = (valor: string) =>
    valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.+|\.+$/g, '');
  const sufijo = createHash('sha256')
    .update(ci.trim() || `${nombres} ${apellidos}`)
    .digest('hex')
    .slice(0, 8);
  const nombreusuario = [normalizarslug(nombres), normalizarslug(apellidos)]
    .filter(Boolean)
    .join('.')
    .slice(0, 48)
    .replace(/\.+$/g, '');
  const dominio = Number.parseInt(sufijo[0], 16) % 2 === 0 ? 'gmail.com' : 'hotmail.com';
  return `${nombreusuario || 'docente'}.${sufijo}@${dominio}`;
}

export function parsearfechanacimiento(valor: unknown): Date {
  const coincidencia =
    typeof valor === 'string' ? valor.trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/) : null;
  if (!coincidencia) {
    throw new Error('Una fecha de nacimiento no tiene el formato válido dd-mm-aaaa.');
  }

  const [, dia, mes, anio] = coincidencia;
  const fechavalidada = new Date(0);
  fechavalidada.setUTCHours(12, 0, 0, 0);
  fechavalidada.setUTCFullYear(Number(anio), Number(mes) - 1, Number(dia));

  const hoy = new Date();
  const limitehoy = new Date(
    Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate(), 23, 59, 59, 999),
  );
  if (
    Number(anio) < 1900 ||
    fechavalidada.getUTCFullYear() !== Number(anio) ||
    fechavalidada.getUTCMonth() !== Number(mes) - 1 ||
    fechavalidada.getUTCDate() !== Number(dia) ||
    fechavalidada > limitehoy
  ) {
    throw new Error('Una fecha de nacimiento no representa un día válido.');
  }
  return fechavalidada;
}

export function obtenergeneroimportado(encabezados: unknown[], fila: unknown[]): generoimportado {
  const indicegenero = encabezados.findIndex((encabezado) => {
    const nombre = normalizartexto(encabezado);
    return ['SEXO', 'GENERO', 'SEX', 'GENDER'].some((termino) => nombre.includes(termino));
  });
  if (indicegenero < 0) return 'UNSPECIFIED';

  const valor = normalizartexto(fila[indicegenero]);
  if (['M', 'MASCULINO', 'VARON', 'HOMBRE'].includes(valor)) return 'MALE';
  if (['F', 'FEMENINO', 'MUJER'].includes(valor)) return 'FEMALE';
  return 'UNSPECIFIED';
}

export function obtenerestadoimportado(
  encabezados: unknown[],
  fila: unknown[],
): estadoinscripcionimportado {
  const indiceestado = encabezados.findIndex((encabezado) => {
    const nombre = normalizartexto(encabezado);
    return (
      nombre === 'STATUS' ||
      nombre === 'ESTADO' ||
      (nombre.includes('ESTADO') && nombre.includes('MATRICULA'))
    );
  });
  if (indiceestado < 0) {
    throw new Error('La hoja de estudiantes no incluye el estado de matrícula.');
  }

  const valor = normalizartexto(fila[indiceestado]);
  if (['ACTIVA', 'ACTIVO', 'VIGENTE', 'INSCRITA', 'INSCRITO', 'ACTIVE'].includes(valor)) {
    return 'ACTIVE';
  }
  if (['INACTIVA', 'INACTIVO', 'INACTIVE'].includes(valor)) return 'INACTIVE';
  if (['TRASLADADA', 'TRASLADADO', 'TRANSFERIDA', 'TRANSFERIDO', 'TRANSFERRED'].includes(valor)) {
    return 'TRANSFERRED';
  }
  if (['GRADUADA', 'GRADUADO', 'EGRESADA', 'EGRESADO', 'GRADUATED'].includes(valor)) {
    return 'GRADUATED';
  }
  if (['RETIRADA', 'RETIRADO', 'BAJA', 'ABANDONO', 'WITHDRAWN'].includes(valor)) {
    return 'WITHDRAWN';
  }
  throw new Error('El estado de matrícula de una fila no es compatible con SIGCE.');
}

export function generarhashcontrasenaaleatoria(): string {
  return bcrypt.hashSync(randomBytes(48).toString('base64url'), 12);
}
