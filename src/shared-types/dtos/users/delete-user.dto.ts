import { z } from "zod";

export const DeleteUserSchema = z
  .object({
    id: z.uuid("The id field must be a valid UUID."),
  })
  .strict();

export type DeleteUserDto = z.infer<typeof DeleteUserSchema>;

export function parseDeleteUser(payload: unknown): [string?, DeleteUserDto?] {
  const r = DeleteUserSchema.safeParse(payload);
  if (!r.success) return [r.error.issues[0]?.message ?? "Invalid payload."];
  return [undefined, r.data];
}
