import { z } from "zod";

export const CreateCustomerSchema = z
  .object({
    name: z.string().min(1, "Customer name is required"),
    type: z.string().min(1, "Identifier type is required"),
    identifier: z.string().min(1, "Identifier value is required"),
    email: z.string().email().trim().toLowerCase(),
    phone: z.string().min(1, "Phone is required"),
    billingAddress: z.string().min(1, "Billing address is required"),
    shippingAddress: z.string().min(1, "Shipping address is required"),
    notes: z.string().min(1, "Notes cannot be empty").optional(),
    isActive: z.boolean().optional().default(true),
  })
  .strict();

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
