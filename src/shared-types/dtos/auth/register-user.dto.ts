import { z } from 'zod';
import { regularExps } from '../../config';

export const RegisterSchema = z.object({
  fullName: z.string().min(1, "Name is required").trim(),
  email: z.email("Invalid email").min(1, "Email is required").transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters long').regex(
    regularExps.password,
    "Invalid password format. Password must contain at least 8 characters, including one uppercase letter, one number, and one special character."
  ),
  companyName: z.string().trim().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
}).strict();

export type RegisterDto = z.infer<typeof RegisterSchema>;


export const DefaultRegisterSchema = RegisterSchema.transform((data) => ({
  ...data,
  companyName: data.companyName || `${data.fullName}'s Business`,
  country: data.country || "US",
  currency: data.currency || "USD",
}));

export type DefaultRegisterDto = z.infer<typeof DefaultRegisterSchema>;
