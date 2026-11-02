import 'reflect-metadata';
import type { FactoryProvider, Type } from '@nestjs/common';
import {
  obtenermetadatosparametrosaplicacion,
  type constructorinyectable,
} from '../../application/aplicacioninyeccion';

interface lectormetadatosreflect {
  getMetadata(clave: string, objetivo: object): unknown;
}

const reflector = Reflect as typeof Reflect & lectormetadatosreflect;

/** Builds a Nest provider at the outer composition boundary for a framework-free application service. */
export function proveedoraplicacion<T>(objetivo: Type<T>): FactoryProvider<T> {
  const tiposparametros =
    (reflector.getMetadata('design:paramtypes', objetivo) as dependenciainyectable[] | undefined) ??
    [];
  const parametrosexplicitos = obtenermetadatosparametrosaplicacion(objetivo);
  const dependenciasinyectadas = tiposparametros.map((tipoparametro, indice) => {
    const metadatos = parametrosexplicitos.get(indice);
    const token = metadatos?.token ?? tipoparametro;
    if (token === Object || token === undefined) {
      throw new Error(
        `No runtime injection token is defined for ${objetivo.name} parameter ${indice}.`,
      );
    }
    return metadatos?.opcional ? { token, optional: true } : token;
  });

  return {
    provide: objetivo,
    inject: dependenciasinyectadas,
    useFactory: (...dependencias: unknown[]) =>
      new objetivo(...(dependencias as ConstructorParameters<typeof objetivo>)),
  };
}

type dependenciainyectable = string | symbol | constructorinyectable;
