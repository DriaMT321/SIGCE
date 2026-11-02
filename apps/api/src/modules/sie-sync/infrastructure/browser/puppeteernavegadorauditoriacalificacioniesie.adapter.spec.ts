import puppeteer from 'puppeteer';
import { crearproxyegresoviejecutacion } from './proxyegresoviejecutacion';
import { adaptadornavegadorpuppeteerauditoriasie } from './puppeteernavegadorauditoriacalificacioniesie.adapter';

const mockproxy = { url: 'http://127.0.0.1:3131', cerrar: jest.fn().mockResolvedValue(undefined) };

jest.mock('puppeteer', () => ({
  __esModule: true,
  default: { launch: jest.fn() },
}));

jest.mock('./proxyegresoviejecutacion', () => ({
  crearproxyegresoviejecutacion: jest.fn(),
}));

describe('PuppeteerSieGradeAuditBrowserAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(crearproxyegresoviejecutacion).mockResolvedValue(mockproxy);
  });

  it('keeps Chromium sandboxing enabled when opening the external SIE portal', async () => {
    const navegador = {
      newPage: jest.fn().mockRejectedValue(new Error('stop after browser launch')),
      close: jest.fn().mockResolvedValue(undefined),
    };
    jest.mocked(puppeteer.launch).mockResolvedValue(navegador as never);

    await expect(
      new adaptadornavegadorpuppeteerauditoriasie().obtenercalificaciones({
        url: 'https://academico.sie.gob.bo',
        usuario: 'prueba',
        contrasena: 'prueba',
        modovisual: false,
        maximocursos: 1,
        filtrocurso: '',
      }),
    ).rejects.toThrow('stop after browser launch');

    const opciones = jest.mocked(puppeteer.launch).mock.calls[0]?.[0];
    expect(opciones?.headless).toBe(true);
    expect(opciones?.args).not.toContain('--no-sandbox');
    expect(opciones?.args).not.toContain('--disable-setuid-sandbox');
    expect(opciones?.args).toContain(`--proxy-server=${mockproxy.url}`);
    expect(opciones?.args).toContain('--proxy-bypass-list=<-loopback>');
    expect(crearproxyegresoviejecutacion).toHaveBeenCalledWith('https://academico.sie.gob.bo');
    expect(navegador.close).toHaveBeenCalledTimes(1);
    expect(mockproxy.cerrar).toHaveBeenCalledTimes(1);
  });

  it('rejects any target other than the official HTTPS SIE origin', async () => {
    await expect(
      new adaptadornavegadorpuppeteerauditoriasie().obtenercalificaciones({
        url: 'https://attacker.example',
        usuario: 'prueba',
        contrasena: 'prueba',
        modovisual: false,
        maximocursos: 1,
        filtrocurso: '',
      }),
    ).rejects.toThrow('La URL del portal SIE debe ser el origen HTTPS oficial.');

    expect(crearproxyegresoviejecutacion).not.toHaveBeenCalled();
    expect(puppeteer.launch).not.toHaveBeenCalled();
  });
});
