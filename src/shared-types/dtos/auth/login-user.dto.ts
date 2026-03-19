import { z } from 'zod';
import { regularExps } from '../../config';

export const LoginSchema = z.object({
  email: z.email("Invalid email").min(1, "Email is required").transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters long').regex(
    regularExps.password,
    "Invalid password format. Password must contain at least 8 characters, including one uppercase letter, one number, and one special character."
  ),
}).strict();

export type LoginDto = z.infer<typeof LoginSchema>;
