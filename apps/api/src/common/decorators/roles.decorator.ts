import { SetMetadata } from '@nestjs/common';
import { rolusuario } from '@academic/shared-types';

export const constanteclaveroles = 'roles';
export const definirroles = (...roles: rolusuario[]) => SetMetadata(constanteclaveroles, roles);
