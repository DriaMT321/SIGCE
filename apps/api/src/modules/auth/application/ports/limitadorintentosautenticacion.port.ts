export const tokenlimitadorintentosautenticacion = Symbol('AUTH_ATTEMPT_LIMITER');

export interface limitadorintentosautenticacionpuerto {
  verificariniciosesion(direccionip: string): Promise<void>;
}
