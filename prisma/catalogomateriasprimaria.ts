// Catálogo configurable para las pantallas de inicial y primaria.
// Se conserva separado del catálogo secundario para evitar que una planilla
// muestre materias que no corresponden al nivel del curso.
export const materiasinicialyprimaria = [
  { code: 'DII', name: 'Desarrollo Integral Infantil', area: 'Desarrollo Infantil' },
  { code: 'MAT', name: 'Matemática (Primaria)', area: 'Ciencia, Tecnología y Producción' },
  { code: 'LC', name: 'Lengua Castellana (Primaria)', area: 'Comunidad y Sociedad' },
  { code: 'LO', name: 'Lengua Originaria (Primaria)', area: 'Comunidad y Sociedad' },
  { code: 'LEX', name: 'Lengua Extranjera (Primaria)', area: 'Comunidad y Sociedad' },
  { code: 'CSO', name: 'Ciencias Sociales (Primaria)', area: 'Comunidad y Sociedad' },
  { code: 'CNA', name: 'Ciencias Naturales (Primaria)', area: 'Vida Tierra Territorio' },
  { code: 'APV', name: 'Artes Plásticas y Visuales (Primaria)', area: 'Comunidad y Sociedad' },
  { code: 'EMU', name: 'Educación Musical (Primaria)', area: 'Comunidad y Sociedad' },
  { code: 'EFD', name: 'Educación Física y Deportes (Primaria)', area: 'Comunidad y Sociedad' },
  {
    code: 'TTG',
    name: 'Técnica Tecnológica General (Primaria)',
    area: 'Ciencia, Tecnología y Producción',
  },
  {
    code: 'VER',
    name: 'Valores, Espiritualidades y Religiones (Primaria)',
    area: 'Cosmos y Pensamiento',
  },
] as const;
