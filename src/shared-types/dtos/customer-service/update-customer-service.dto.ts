import { z } from "zod";

export const UpdateCustomerServiceSchema = z
  .object({
    uuid: z.string().uuid("CustomerService uuid must be a valid UUIDv4"),

    customer: z.string().uuid("Customer must be a valid UUIDv4").optional(),
    product: z.string().uuid("Product must be a valid UUIDv4").optional(),
    owner: z.string().uuid("Owner must be a valid UUIDv4").optional(),

    customPrice: z.coerce.number().min(0, "Custom price must be 0 or greater").optional(),

    currency: z.string().min(1, "Currency cannot be empty").optional(),
    notes: z.string().optional(),
  })
  .strict();

export type UpdateCustomerServiceDto = z.infer<typeof UpdateCustomerServiceSchema>;
