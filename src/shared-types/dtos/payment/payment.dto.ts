import { z } from "zod";

export const PaymentStatus = z.enum(["PENDING", "PROCESSING", "SUCCEEDED", "COMPLETED", "FAILED", "CANCELED", "REFUNDED", "PARTIALLY_REFUNDED"]);
export const PaymentMethod = z.enum(["CARD", "BANK_TRANSFER", "PAYPAL", "OTHER"]);

export const PaymentSchema = z
  .object({
    id: z.string().uuid("Payment id must be a valid UUIDv4"),

    amount: z.coerce.number().min(0, "Amount must be 0 or greater"),
    currency: z.string().min(1, "Currency is required"),

    method: PaymentMethod,
    status: PaymentStatus,

    description: z.string().optional(),
    reference: z.string().optional(),

    paidAt: z.iso.datetime().optional(),

    owner: z.string().uuid("Owner must be a valid UUIDv4"),

    isActive: z.boolean(),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export type Payment = z.infer<typeof PaymentSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatus>;
export type PaymentMethod = z.infer<typeof PaymentMethod>;
