import { useEffect, useState } from 'react';

export interface datosinstitucionales {
  distrito: string;
  codigoSie: string;
  director: string;
  direccion: string;
  telefono: string;
}

const clave = 'sigce:datos-institucionales:v2';
const iniciales: datosinstitucionales = {
  distrito: '',
  codigoSie: '81981191',
  director: '',
  direccion: '',
  telefono: '',
};

export function anodegestion(nombre: string): string {
  return nombre.match(/\b20\d{2}\b/)?.[0] ?? nombre;
}

export function usardatosinstitucionales() {
  const [datos, establecerdatos] = useState<datosinstitucionales>(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem(clave) || '{}') as Partial<datosinstitucionales>;
      const validos = Object.fromEntries(Object.entries(guardados).filter(([campo, valor]) => campo in iniciales && typeof valor === 'string'));
      return { ...iniciales, ...validos };
    } catch {
      return iniciales;
    }
  });

  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(datos));
  }, [datos]);

  return [datos, establecerdatos] as const;
}

