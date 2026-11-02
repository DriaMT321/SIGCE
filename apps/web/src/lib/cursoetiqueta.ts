export function cursoetiqueta(nombre: string): string {
  return nombre
    .replace(/Primaria Comunitaria Vocacional/gi, 'Primaria')
    .replace(/Secundaria Comunitaria Productiva/gi, 'Secundaria')
    .replace(/Inicial en Familia Comunitaria/gi, 'Inicial')
    .replace(/\s*[-–]\s*/g, ' · ');
}

export function turnoetiqueta(turno: string | null | undefined): string {
  if (turno === 'MORNING') return 'Mañana';
  if (turno === 'AFTERNOON') return 'Tarde';
  if (turno === 'EVENING') return 'Noche';
  return turno || 'Sin turno';
}
