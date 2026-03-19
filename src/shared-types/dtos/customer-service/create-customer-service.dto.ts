import { z } from "zod";

export const CreateCustomerServiceSchema = z
  .object({
    customer: z.string().uuid("Customer must be a valid UUIDv4"),
    product: z.string().uuid("Product must be a valid UUIDv4"),

    customPrice: z.coerce.number().min(0, "Custom price must be 0 or greater"),

    currency: z.string().min(1, "Currency is required"),
    notes: z.string().optional(),
  })
  .strict();

export type CreateCustomerServiceDto = z.infer<typeof CreateCustomerServiceSchema>;
