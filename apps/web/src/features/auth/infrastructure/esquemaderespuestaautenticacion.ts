import { z } from 'zod';
import type { autenticacionusuario } from '../application/gestionautenticacion';

export const autenticacionusuarioesquema: z.ZodType<autenticacionusuario> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
});

export const webautenticacionrespuestaesquema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    user: autenticacionusuarioesquema,
  }),
});
