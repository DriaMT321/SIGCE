import {
  leeraliassie,
  leerbooleanoconfiguraciontrabajador,
  leerenteroconfiguraciontrabajador,
  leermapanotassie,
  leertasaconfiguraciontrabajador,
  leerurloficialsie,
} from './configuraciontrabajador.config';

describe('configuración numérica del worker SIE', () => {
  it('acepta un entero dentro del rango', () => {
    expect(leerenteroconfiguraciontrabajador('REDIS_PORT', '6380', 6379, 1, 65535)).toBe(6380);
  });

  it('rechaza valores inválidos y fuera de rango al iniciar', () => {
    expect(() => leerenteroconfiguraciontrabajador('REDIS_PORT', '63x', 6379, 1, 65535)).toThrow(
      'REDIS_PORT debe ser un número entero',
    );
  });
});

describe('umbral de discrepancias del worker SIE', () => {
  it('acepta proporciones mayores que cero y hasta uno', () => {
    expect(leertasaconfiguraciontrabajador('SIE_SYNC_DISCREPANCY_THRESHOLD', '0.25', 0.2)).toBe(
      0.25,
    );
    expect(leertasaconfiguraciontrabajador('SIE_SYNC_DISCREPANCY_THRESHOLD', undefined, 0.2)).toBe(
      0.2,
    );
  });

  it('rechaza umbrales que no sean una proporción válida', () => {
    expect(() =>
      leertasaconfiguraciontrabajador('SIE_SYNC_DISCREPANCY_THRESHOLD', '0', 0.2),
    ).toThrow();
    expect(() =>
      leertasaconfiguraciontrabajador('SIE_SYNC_DISCREPANCY_THRESHOLD', '1.2', 0.2),
    ).toThrow();
  });
});

describe('configuración de la integración real SIE', () => {
  it('acepta el origen oficial y rechaza destinos no oficiales', () => {
    expect(leerurloficialsie(undefined)).toBe('https://academico.sie.gob.bo');
    expect(leerurloficialsie('https://academico.sie.gob.bo/')).toBe(
      'https://academico.sie.gob.bo',
    );
    expect(() => leerurloficialsie('http://academico.sie.gob.bo')).toThrow('oficial');
    expect(() => leerurloficialsie('https://sie.gob.bo.ejemplo.com')).toThrow('oficial');
    expect(() => leerurloficialsie('https://academico.sie.gob.bo/otra')).toThrow('oficial');
  });

  it('interpreta booleanos de entorno de forma estricta', () => {
    expect(leerbooleanoconfiguraciontrabajador('FLAG', 'true', false)).toBe(true);
    expect(leerbooleanoconfiguraciontrabajador('FLAG', '0', true)).toBe(false);
    expect(leerbooleanoconfiguraciontrabajador('FLAG', undefined, false)).toBe(false);
    expect(() => leerbooleanoconfiguraciontrabajador('FLAG', 'quizas', false)).toThrow();
  });

  it('mapea períodos a idNotaTipo y conserva el 6 como valor conocido del primer trimestre', () => {
    expect(leermapanotassie(undefined)).toEqual({ 1: 6 });
    expect(leermapanotassie('1:6,2:7,3:8')).toEqual({ 1: 6, 2: 7, 3: 8 });
    expect(() => leermapanotassie('1-6')).toThrow('formato');
    expect(() => leermapanotassie('1:6,2:abc')).toThrow('formato');
  });

  it('valida el mapa JSON de alias de asignaturas', () => {
    expect(leeraliassie(undefined)).toEqual({});
    expect(leeraliassie('{"LEN-SEC":"Lengua Castellana y Originaria"}')).toEqual({
      'LEN-SEC': 'Lengua Castellana y Originaria',
    });
    expect(() => leeraliassie('[]')).toThrow('objeto JSON');
    expect(() => leeraliassie('{"LEN-SEC":""}')).toThrow('texto no vacío');
  });
});

describe('cifrado de la conexión Redis del worker SIE', () => {
  it('activa TLS cuando REDIS_URL usa rediss', async () => {
    const urlAnterior = process.env.REDIS_URL;
    process.env.REDIS_URL = 'rediss://usuario:secreto@redis.example:6380';
    jest.resetModules();

    try {
      const { configuraciontrabajador: configuracion } =
        await import('./configuraciontrabajador.config');

      expect(configuracion.redis).toMatchObject({
        servidor: 'redis.example',
        puerto: 6380,
        contrasena: 'secreto',
        usartls: true,
      });
    } finally {
      if (urlAnterior === undefined) delete process.env.REDIS_URL;
      else process.env.REDIS_URL = urlAnterior;
      jest.resetModules();
    }
  });

  it('rechaza Redis sin TLS y contraseña en producción', async () => {
    const entornoanterior = {
      NODE_ENV: process.env.NODE_ENV,
      REDIS_URL: process.env.REDIS_URL,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_TLS: process.env.REDIS_TLS,
    };
    process.env.NODE_ENV = 'production';
    process.env.REDIS_URL = 'redis://redis.example:6379';
    delete process.env.REDIS_PASSWORD;
    delete process.env.REDIS_TLS;
    jest.resetModules();

    try {
      await expect(import('./configuraciontrabajador.config')).rejects.toThrow(
        'Redis requiere TLS y una contraseña',
      );
      process.env.REDIS_URL = 'rediss://redis:secreto@redis.example:6380';
      jest.resetModules();
      const { configuraciontrabajador: configuracion } =
        await import('./configuraciontrabajador.config');
      expect(configuracion.redis.usartls).toBe(true);
      expect(configuracion.redis.contrasena).toBe('secreto');
    } finally {
      for (const [clave, valor] of Object.entries(entornoanterior)) {
        if (valor === undefined) delete process.env[clave];
        else process.env[clave] = valor;
      }
      jest.resetModules();
    }
  });
});
