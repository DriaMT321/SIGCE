import type {
  decisiondiscrepanciasie,
  puertoresolvergrupodiscrepanciassie,
} from '../ports/repositoriosincronizacionsie';

export interface entradaresolvergrupodiscrepanciassie {
  groupId: string;
  decision: decisiondiscrepanciasie;
  reason: string;
  userId: string;
  ipAddress?: string;
  correlationId?: string;
}

export class casousoresolvergrupodiscrepanciassie {
  constructor(private readonly repositorio: puertoresolvergrupodiscrepanciassie) {}

  ejecutar(entrada: entradaresolvergrupodiscrepanciassie) {
    return this.repositorio.resolvergrupodiscrepancias(entrada);
  }
}
