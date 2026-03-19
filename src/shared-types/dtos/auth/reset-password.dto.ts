import { z } from 'zod';
import { regularExps } from '../../config';

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long').regex(
    regularExps.password,
    "Invalid password format. Password must contain at least 8 characters, including one uppercase letter, one number, and one special character."
  ),
}).strict();

export type ResetPasswordDto= z.infer<typeof ResetPasswordSchema>;
