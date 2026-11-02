import { estadosincronizacionsie } from '@academic/domain-kernel';

export const constantetamanomaximolotesincronizacionsie = 50;

export function calcularestadoreanudacionsie(entrada: {
  elementosencola: number;
  elementosprocesando: number;
  elementosprocesados: number;
  elementosesperados: number;
  cantidaderrores: number;
  cantidaddiscrepancias: number;
}): estadosincronizacionsie | null {
  if (entrada.elementosencola > 0) return estadosincronizacionsie.QUEUED;
  if (entrada.elementosprocesando > 0) return estadosincronizacionsie.PROCESSING;
  if (entrada.elementosprocesados < entrada.elementosesperados) return null;
  if (entrada.cantidaderrores > 0) return estadosincronizacionsie.FAILED;
  if (entrada.cantidaddiscrepancias > 0) return estadosincronizacionsie.DISCREPANCY;
  return estadosincronizacionsie.VERIFIED;
}

export function determinarestadogrupodiscrepanciasie(
  elementospendientes: number,
): 'IN_PROGRESS' | 'RESOLVED' {
  return elementospendientes > 0 ? 'IN_PROGRESS' : 'RESOLVED';
}
