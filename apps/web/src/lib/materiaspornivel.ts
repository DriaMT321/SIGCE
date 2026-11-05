import { obtenierniveleducativoregular } from '@academic/academic-domain';

const codigosprimaria = new Set([
  'MAT',
  'LC',
  'LO',
  'LEX',
  'CSO',
  'CNA',
  'APV',
  'EMU',
  'EFD',
  'TTG',
  'VER',
]);

const codigossecundaria = new Set([
  'MAT',
  'LC',
  'LO',
  'LEX',
  'BIO',
  'FIS',
  'QUI',
  'CSO',
  'APV',
  'EMU',
  'EFD',
  'CFS',
  'VER',
  'TTG',
  'LEN-SEC',
  'HIS-SEC',
]);

export function materiacorrespondealgrado(codigo: string, grado: number): boolean {
  const nivel = obtenierniveleducativoregular(grado);
  if (nivel === 'INITIAL') return codigo === 'DII';
  if (nivel === 'PRIMARY') return codigosprimaria.has(codigo);
  if (nivel === 'SECONDARY') return codigossecundaria.has(codigo) || codigo.endsWith('-SEC');
  return false;
}
