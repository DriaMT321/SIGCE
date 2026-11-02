import { estadosincronizacionsie } from '@academic/domain-kernel';

export class entidadresultadosincronizacionsie {
  constructor(
    public readonly idsincronizacion: string,
    public readonly idelemento: string,
    public readonly rudeestudiante: string,
    public readonly valorlocal: number,
    public readonly valorsie: number,
    public readonly estado: estadosincronizacionsie,
    public readonly coincide: boolean,
    public readonly verificadoen: Date,
    public readonly mensajeerror?: string,
  ) {}
}
