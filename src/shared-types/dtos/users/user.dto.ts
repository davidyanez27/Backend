import { z } from "zod";
import { regularExps } from "../../config";

export const AppRoleEnum = z.enum(["USER", "ADMIN"]);
export type AppRole = z.infer<typeof AppRoleEnum>;

export const UserSchema = z
  .object({
    uuid: z.string().min(1, "uuid property is required"),
    email: z.string().min(1, "email property is required").regex(regularExps.email, "email property is required"),
    fullName: z.string().min(1, "full Name property is required"),
    appRole: AppRoleEnum.default("USER"),
    isActive: z.boolean({ message: "isActive property must be a boolean" }),
    emailValidated: z.boolean().default(false),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional(),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;


