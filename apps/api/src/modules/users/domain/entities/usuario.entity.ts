import { rolusuario } from '@academic/domain-kernel';

export class entidadusuario {
  constructor(
    public readonly id: string,
    public readonly correoElectronico: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly rol: rolusuario,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date | null,
    public readonly passwordSetupRequired = false,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
