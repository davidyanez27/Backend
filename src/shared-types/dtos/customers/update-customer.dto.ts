import { z } from "zod";

export const UpdateCustomerSchema = z
  .object({
    uuid: z.string().uuid("Customer uuid must be a valid UUIDv4"),

    name: z.string().min(1, "Customer name cannot be empty").optional(),
    phone: z.string().min(1, "Phone cannot be empty").optional(),
    billingAddress: z.string().min(1, "Billing address cannot be empty").optional(),
    shippingAddress: z.string().min(1, "Shipping address cannot be empty").optional(),
    owner: z.string().uuid("Owner must be a valid UUIDv4").optional(),
    notes: z.string().min(1, "Notes name cannot be empty").optional(),
    email: z.string().email("Email must be a valid email").trim().toLowerCase().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
