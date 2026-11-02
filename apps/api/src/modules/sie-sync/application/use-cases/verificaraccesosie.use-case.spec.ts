import { errorsolicitudincorrecta } from '../../../../core/application/aplicacionerror';
import { verificadoraccesosie } from '../ports/verificadoraccesosie.port';
import { casousoverificaraccesosie } from './verificaraccesosie.use-case';

describe('CheckSieLoginUseCase credentials', () => {
  const verificador = { verificar: jest.fn() } as jest.Mocked<verificadoraccesosie>;
  const usocaso = new casousoverificaraccesosie(verificador);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requires credentials for the current operation', async () => {
    await expect(usocaso.ejecutar({ username: 'operator', password: '  ' })).rejects.toBeInstanceOf(
      errorsolicitudincorrecta,
    );
    expect(verificador.verificar).not.toHaveBeenCalled();
  });

  it('passes the current credentials to the verifier without altering the password', async () => {
    const resultado = {
      active: true,
      httpStatus: 200,
      loginSuccess: true,
      portalUrl: 'https://academico.sie.gob.bo/',
      portalTitle: 'Portal SIE',
      message: 'Acceso validado.',
      checkedAt: '2026-10-22T00:00:00.000Z',
    };
    verificador.verificar.mockResolvedValue(resultado);

    await expect(
      usocaso.ejecutar({ username: ' operator ', password: ' secret ' }),
    ).resolves.toEqual(resultado);
    expect(verificador.verificar).toHaveBeenCalledWith({
      username: 'operator',
      password: ' secret ',
    });
  });
});
