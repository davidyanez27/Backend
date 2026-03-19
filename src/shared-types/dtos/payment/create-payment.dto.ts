import { z } from "zod";
import { PaymentMethod, PaymentStatus } from "./payment.dto";

// SubscriptionPayments are typically created by Stripe webhook handlers.
// This schema is for the rare case of recording a manual/external payment.
export const CreatePaymentSchema = z
  .object({
    amount: z.coerce.number().min(0, "Amount must be 0 or greater"),
    currency: z.string().min(1, "Currency is required"),
    paymentMethod: PaymentMethod,
    status: PaymentStatus.optional().default("PENDING"),
    description: z.string().optional(),

    // Stripe IDs — filled by webhook handler, optional for manual creation
    stripePaymentIntentId: z.string().optional(),
    stripeInvoiceId: z.string().optional(),

    // Link to subscription
    subscriptionId: z.number().int().positive().optional(),
  })
  .strict();

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;
