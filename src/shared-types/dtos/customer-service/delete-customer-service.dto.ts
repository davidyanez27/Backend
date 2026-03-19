import { z } from "zod";

export const DeleteCustomerServiceSchema = z
  .object({
    uuid: z.string().uuid("CustomerService uuid must be a valid UUIDv4"),
  })
  .strict();

export type DeleteCustomerServiceDto = z.infer<typeof DeleteCustomerServiceSchema>;
