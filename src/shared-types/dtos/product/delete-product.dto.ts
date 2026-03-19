import { z } from "zod";

export const DeleteProductSchema = z
  .object({
    uuid: z.string().uuid("Product uuid must be a valid UUIDv4"),
  })
  .strict();

export type DeleteProductDto = z.infer<typeof DeleteProductSchema>;
