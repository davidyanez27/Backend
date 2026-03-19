import { z } from "zod";

export const RoleSchema = z
  .object({
    uuid: z.string().min(1, "uuid property is required"),
    name: z.string().min(1, "name property is required"),
    isSystem: z.boolean({ message: "isSystem property must be a boolean" }),
    companyId: z.string().min(1, "companyId property is required"),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional(),
  })
  .strict();

export type RoleDto = z.infer<typeof RoleSchema>;
