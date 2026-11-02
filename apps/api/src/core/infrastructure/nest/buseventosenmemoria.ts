import { eventoaplicacion, manejadoreventoaplicacion } from '../../application/aplicacionevento';
import { buseventosaplicacion } from '../../application/buseventosaplicacion.port';

export class buseventosaplicacionenmemoria implements buseventosaplicacion {
  private readonly manejadores = new Map<
    string,
    Set<manejadoreventoaplicacion<eventoaplicacion>>
  >();

  async publicar<TEvent extends eventoaplicacion>(evento: TEvent): Promise<void> {
    const manejadores = [...(this.manejadores.get(evento.type) ?? [])];
    await Promise.all(manejadores.map((manejador) => manejador(evento)));
  }

  suscribir<TEvent extends eventoaplicacion>(
    tipoevento: TEvent['type'],
    manejador: manejadoreventoaplicacion<TEvent>,
  ): () => void {
    const manejadores = this.manejadores.get(tipoevento) ?? new Set();
    const manejadortipado = manejador as manejadoreventoaplicacion<eventoaplicacion>;
    manejadores.add(manejadortipado);
    this.manejadores.set(tipoevento, manejadores);

    return () => {
      manejadores.delete(manejadortipado);
      if (manejadores.size === 0) this.manejadores.delete(tipoevento);
    };
  }
}
