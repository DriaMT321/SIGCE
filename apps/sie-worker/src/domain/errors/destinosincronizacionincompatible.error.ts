export class errordestinosincronizacionincompatible extends Error {
  constructor() {
    super('El lote quedó pausado porque su destino no coincide con el trabajador disponible.');
    this.name = 'errordestinosincronizacionincompatible';
  }
}
