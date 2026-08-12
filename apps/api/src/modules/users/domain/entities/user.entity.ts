import { UserRole } from '@academic/shared-types';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date | null,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
