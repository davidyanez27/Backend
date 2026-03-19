import { z } from 'zod';

export const ForgotPasswordSchema = z
  .object({
    email: z.string().min(1, "Email is required").email().trim().toLowerCase(),
  })
  .strict();

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
