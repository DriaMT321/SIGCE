import { SetMetadata } from '@nestjs/common';

export const constanteclavepermisos = 'permissions';
export const definirpermisos = (...permissions: string[]) =>
  SetMetadata(constanteclavepermisos, permissions);
