const CAMPOS_REQUERIDOS_SIE_LOCAL = ['rude', 'year', 'period', 'subject', 'grade'];

export function validarcampospaginasielocal(campos: ReadonlyArray<string>): void {
  const disponibles = new Set(campos);
  const faltantes = CAMPOS_REQUERIDOS_SIE_LOCAL.filter((campo) => !disponibles.has(campo));
  if (faltantes.length > 0) {
    throw new Error(
      `La página SIE de prueba no contiene los campos requeridos: ${faltantes.join(', ')}`,
    );
  }
}
