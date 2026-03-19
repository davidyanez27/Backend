import { z } from "zod";


export const UpdateUserSchema = z
  .object({
    email: z.email("Invalid email").min(1, "Email is required").transform((v) => v.trim().toLowerCase()),
    fullName: z.string().optional(),
    // roleId: z.coerce.number().int({ message: "Role property must be an integer" }).positive({ message: "Role property must be a valid positive integer" }).optional(),
  }).strict();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

