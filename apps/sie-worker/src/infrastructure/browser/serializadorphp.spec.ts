import { construirinfoue, serializarphp, type datosinfoue } from './serializadorphp';

const infoue: datosinfoue = {
  nivel: 'Secundaria Comunitaria Productiva',
  grado: 'Primero',
  paralelo: 'B',
  turno: 'MAÑANA',
  paraleloId: '2',
  turnoId: 1,
  nivelId: 13,
  gradoId: 1,
  cicloId: 1,
  iecId: 123456789,
  sie: '90000001',
  gestion: '2026',
};

describe('serializador PHP del SIE', () => {
  it('cuenta bytes UTF-8 y no caracteres para los strings', () => {
    expect(serializarphp('MAÑANA')).toBe('s:7:"MAÑANA";');
    expect(serializarphp('ñ')).toBe('s:2:"ñ";');
    expect(serializarphp('🙂')).toBe('s:4:"🙂";');
  });

  it('serializa escalares, listas y objetos en el orden de inserción', () => {
    expect(serializarphp(null)).toBe('N;');
    expect(serializarphp(true)).toBe('b:1;');
    expect(serializarphp(false)).toBe('b:0;');
    expect(serializarphp(42)).toBe('i:42;');
    expect(serializarphp(97.5)).toBe('d:97.5;');
    expect(serializarphp([1, 'a'])).toBe('a:2:{i:0;i:1;i:1;s:1:"a";}');
    expect(serializarphp({ b: 1, a: 'x' })).toBe('a:2:{s:1:"b";i:1;s:1:"a";s:1:"x";}');
  });

  it('construye infoUe con la estructura exacta que consume el portal', () => {
    expect(construirinfoue(infoue)).toBe(
      'a:3:{' +
        's:14:"ueducativaInfo";a:4:{' +
        's:5:"nivel";s:33:"Secundaria Comunitaria Productiva";' +
        's:5:"grado";s:7:"Primero";' +
        's:8:"paralelo";s:1:"B";' +
        's:5:"turno";s:7:"MAÑANA";' +
        '}' +
        's:16:"ueducativaInfoId";a:6:{' +
        's:10:"paraleloId";s:1:"2";' +
        's:7:"turnoId";i:1;' +
        's:7:"nivelId";i:13;' +
        's:7:"gradoId";i:1;' +
        's:7:"cicloId";i:1;' +
        's:5:"iecId";i:123456789;' +
        '}' +
        's:11:"requestUser";a:4:{' +
        's:3:"sie";s:8:"90000001";' +
        's:7:"gestion";s:4:"2026";' +
        's:23:"swRegisterCalifications";b:1;' +
        's:19:"swRegisterPersonBjp";b:1;' +
        '}' +
        '}',
    );
  });

  it('mantiene el formato al pasar por URL encoding', () => {
    const codificado = encodeURIComponent(construirinfoue(infoue));
    expect(codificado).toContain('s%3A7%3A%22MA%C3%91ANA%22%3B');
    expect(decodeURIComponent(codificado)).toBe(construirinfoue(infoue));
  });
});
