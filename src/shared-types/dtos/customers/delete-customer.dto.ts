import { z } from "zod";

export const DeleteCustomerSchema = z
  .object({
    uuid: z.string().uuid("Customer uuid must be a valid UUIDv4"),
  })
  .strict();

export type DeleteCustomerDto = z.infer<typeof DeleteCustomerSchema>;
