export type codigoerroraplicacion =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'TOO_MANY_REQUESTS'
  | 'SERVICE_UNAVAILABLE';

export class erroraplicacion extends Error {
  constructor(
    readonly code: codigoerroraplicacion,
    mensaje: string,
    readonly details?: unknown,
  ) {
    super(mensaje);
    this.name = 'ApplicationError';
  }
}

export class errorsolicitudincorrecta extends erroraplicacion {
  constructor(mensaje: string, detalles?: unknown) {
    super('BAD_REQUEST', mensaje, detalles);
  }
}

export class errornoautorizado extends erroraplicacion {
  constructor(mensaje: string, detalles?: unknown) {
    super('UNAUTHORIZED', mensaje, detalles);
  }
}

export class errorprohibido extends erroraplicacion {
  constructor(mensaje: string, detalles?: unknown) {
    super('FORBIDDEN', mensaje, detalles);
  }
}

export class errornoencontrado extends erroraplicacion {
  constructor(mensaje: string, detalles?: unknown) {
    super('NOT_FOUND', mensaje, detalles);
  }
}

export class errorconflictoaplicacion extends erroraplicacion {
  constructor(mensaje: string, detalles?: unknown) {
    super('CONFLICT', mensaje, detalles);
  }
}

export class errordemasiadassolicitudes extends erroraplicacion {
  constructor(mensaje: string, detalles?: unknown) {
    super('TOO_MANY_REQUESTS', mensaje, detalles);
  }
}

export class errorservicionodisponible extends erroraplicacion {
  constructor(mensaje: string, detalles?: unknown) {
    super('SERVICE_UNAVAILABLE', mensaje, detalles);
  }
}
