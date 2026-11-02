export type constructorinyectable = new (...args: never[]) => unknown;
export type tokeninyeccion = string | symbol | constructorinyectable;

interface metadatosparametro {
  token?: tokeninyeccion;
  opcional?: boolean;
}

const metadatosparametros = new WeakMap<object, Map<number, metadatosparametro>>();

function obtenermetadatos(objetivo: object, indice: number): metadatosparametro {
  let parametros = metadatosparametros.get(objetivo);
  if (!parametros) {
    parametros = new Map();
    metadatosparametros.set(objetivo, parametros);
  }
  let metadatos = parametros.get(indice);
  if (!metadatos) {
    metadatos = {};
    parametros.set(indice, metadatos);
  }
  return metadatos;
}

/** Marks an application service without importing a web framework. */
export function servicioaplicacion(): ClassDecorator {
  return () => undefined;
}

/** Identifies a port whose TypeScript interface has no runtime constructor. */
export function inyectarpuerto(token: tokeninyeccion): ParameterDecorator {
  return (objetivo, _propiedadclave, indiceparametro) => {
    obtenermetadatos(objetivo as object, indiceparametro).token = token;
  };
}

/** Marks an optional application collaborator for the composition root. */
export function dependenciaopcional(): ParameterDecorator {
  return (objetivo, _propiedadclave, indiceparametro) => {
    obtenermetadatos(objetivo as object, indiceparametro).opcional = true;
  };
}

export function obtenermetadatosparametrosaplicacion(
  objetivo: object,
): ReadonlyMap<number, metadatosparametro> {
  return metadatosparametros.get(objetivo) ?? new Map();
}
