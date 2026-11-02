export class errorautenticacionsierequerida extends Error {
  constructor() {
    super('La autenticación del SIE requiere atención.');
    this.name = 'ErrorAutenticacionSIERequerida';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
