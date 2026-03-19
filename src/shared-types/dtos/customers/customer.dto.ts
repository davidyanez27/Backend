import { z } from "zod";

// Single identifier (type + value) - flexible, user-defined types
export const CustomerIdentifierSchema = z.object({
  type: z.string().min(1, "Identifier type is required"),
  value: z.string().min(1, "Identifier value is required"),
}).strict();

export type CustomerIdentifier = z.infer<typeof CustomerIdentifierSchema>;

export const CustomerSchema = z
  .object({
    id: z.string().uuid("Customer id must be a valid UUIDv4"),
    name: z.string().min(1, "Customer name is required"),
    email: z.string().email().optional(),
    phone: z.string().min(1, "Phone is required"),
    identifier: CustomerIdentifierSchema,
    billingAddress: z.string().min(1, "Billing address is required"),
    shippingAddress: z.string().min(1, "Shipping address is required"),
    notes: z.string().optional(),
    isActive: z.boolean().default(true),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Customer = z.infer<typeof CustomerSchema>;
