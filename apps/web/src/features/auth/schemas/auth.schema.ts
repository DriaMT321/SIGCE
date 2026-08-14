import { z } from 'zod';

export const loginRoles = ['STUDENT', 'TEACHER', 'FAMILY', 'ADMINISTRATIVE'] as const;
export const loginRoleSchema = z.enum(loginRoles);
export type LoginRole = z.infer<typeof loginRoleSchema>;

export const loginSchema = z
  .object({
    role: loginRoleSchema,
    identifier: z.string().trim().min(1, 'Ingresa el identificador solicitado'),
    secret: z.string().optional(),
    secondaryIdentifier: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.role === 'TEACHER' || data.role === 'ADMINISTRATIVE') {
      if (!data.secret || data.secret.length < 6) {
        context.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 6,
          inclusive: true,
          type: 'string',
          path: ['secret'],
          message: 'La clave debe tener al menos 6 caracteres',
        });
      }
    }

    if (data.role === 'FAMILY' && !data.secondaryIdentifier?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['secondaryIdentifier'],
        message: 'Ingresa el número de celular',
      });
    }
  });

export type LoginFormData = z.infer<typeof loginSchema>;

export const authResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: z.object({
      id: z.string(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      role: z.string(),
    }),
  }),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
