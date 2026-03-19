import { z } from "zod";
import { regularExps } from "../../config";


export const CreateUserSchema = z
  .object({
    email: z.email("Invalid email").min(1, "Email is required").transform((v) => v.trim().toLowerCase()),
    password: z.string().min(8, 'Password must be at least 8 characters long').regex(
      regularExps.password,
      "Invalid password format. Password must contain at least 8 characters, including one uppercase letter, one number, and one special character."
    ),
    fullName: z.string().min(1, "Full name is required")
  })
  .strict();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const CreateUserFormSchema = CreateUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type CreateUserFormDto = z.infer<typeof CreateUserFormSchema>;
