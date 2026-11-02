import { errorsolicitudincorrecta } from '../../../../core/application/aplicacionerror';
import { urloficialsie } from './urlsieoficial';

describe('officialSieUrl', () => {
  it('acepta solo el origen oficial mediante HTTPS', () => {
    expect(urloficialsie('https://academico.sie.gob.bo/')).toBe('https://academico.sie.gob.bo');
  });

  it.each([
    'http://academico.sie.gob.bo',
    'https://academico.sie.gob.bo.attacker.example',
    'https://example.com',
    'https://academico.sie.gob.bo/path',
  ])('rechaza un destino no oficial: %s', (url) => {
    expect(() => urloficialsie(url)).toThrow(errorsolicitudincorrecta);
  });
});
