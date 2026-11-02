import { accionauditoria } from '@academic/domain-kernel';

export class entidadregistroauditoria {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
    public readonly action: accionauditoria,
    public readonly entity: string,
    public readonly entityId: string,
    public readonly previousValue: Record<string, unknown> | null,
    public readonly newValue: Record<string, unknown> | null,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly createdAt: Date,
    public readonly reason: string | null = null,
    public readonly correlationId: string | null = null,
    public readonly studentIds: string[] = [],
  ) {}

  static crear(parametros: {
    userId?: string | null;
    action: accionauditoria;
    entity: string;
    entityId: string;
    previousValue?: Record<string, unknown> | null;
    newValue?: Record<string, unknown> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    reason?: string | null;
    correlationId?: string | null;
    studentIds?: string[];
  }): entidadregistroauditoria {
    return new entidadregistroauditoria(
      '',
      parametros.userId ?? null,
      parametros.action,
      parametros.entity,
      parametros.entityId,
      parametros.previousValue ?? null,
      parametros.newValue ?? null,
      parametros.ipAddress ?? null,
      parametros.userAgent ?? null,
      new Date(),
      parametros.reason ?? null,
      parametros.correlationId ?? null,
      parametros.studentIds ?? [],
    );
  }
}
