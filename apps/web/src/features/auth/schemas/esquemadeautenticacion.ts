import { z } from 'zod';

export const sesionroles = ['STUDENT', 'TEACHER', 'FAMILY', 'ADMINISTRATIVE'] as const;
export const sesionrolesquema = z.enum(sesionroles);
export type sesionrol = z.infer<typeof sesionrolesquema>;

export const sesionesquema = z
  .object({
    role: sesionrolesquema,
    identifier: z.string().trim().min(1, 'Ingresa el identificador solicitado'),
    secret: z.string().optional(),
    secondaryIdentifier: z.string().optional(),
  })
  .superRefine((datos, contexto) => {
    if (
      datos.role === 'STUDENT' ||
      datos.role === 'TEACHER' ||
      datos.role === 'FAMILY' ||
      datos.role === 'ADMINISTRATIVE'
    ) {
      if (!datos.secret || datos.secret.length < 6) {
        contexto.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 6,
          inclusive: true,
          type: 'string',
          path: ['secret'],
          message: 'La clave debe tener al menos 6 caracteres',
        });
      }
    }

    if (datos.role === 'FAMILY' && !datos.secondaryIdentifier?.trim()) {
      contexto.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['secondaryIdentifier'],
        message: 'Ingresa el número de celular',
      });
    }
  });

export type sesionformulariodatos = z.infer<typeof sesionesquema>;
