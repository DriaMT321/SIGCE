import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { dtofiltrosusuarios } from '../../modules/users/presentation/dto/filtrosusuarios.dto';
import { dtopaginacion } from './paginacion.dto';

describe('dtopaginacion', () => {
  it('normaliza la búsqueda y transforma límites válidos', () => {
    const filtros = plainToInstance(dtopaginacion, {
      search: '  Ana  ',
      limit: '100',
      offset: '20',
    });

    expect(validateSync(filtros)).toHaveLength(0);
    expect(filtros).toMatchObject({ search: 'Ana', limit: 100, offset: 20 });
  });

  it.each([
    { limit: '-1' },
    { limit: '0' },
    { limit: '1.5' },
    { limit: 'texto' },
    { limit: '1001' },
    { offset: '-1' },
    { offset: '1.5' },
    { offset: 'texto' },
    { offset: '1000001' },
    { offset: '1e24' },
  ])('rechaza filtros de paginación inválidos: %o', (entrada) => {
    const filtros = plainToInstance(dtopaginacion, entrada);

    expect(validateSync(filtros).length).toBeGreaterThan(0);
  });
});

describe('dtofiltrosusuarios', () => {
  it('rechaza roles que no pertenecen al catálogo del sistema', () => {
    const filtros = plainToInstance(dtofiltrosusuarios, { role: 'SUPERUSER' });

    expect(validateSync(filtros).map((error) => error.property)).toContain('role');
  });
});
