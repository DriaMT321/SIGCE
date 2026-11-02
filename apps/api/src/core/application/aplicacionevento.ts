export interface eventoaplicacion {
  readonly type: string;
}

export type manejadoreventoaplicacion<TEvent extends eventoaplicacion> = (
  evento: TEvent,
) => Promise<void>;
