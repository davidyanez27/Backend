import { z } from "zod";
import { PaymentStatus } from "./payment.dto";

// SubscriptionPayments are primarily managed by Stripe webhooks.
// This schema covers the few fields an admin might manually adjust.
export const UpdatePaymentSchema = z
  .object({
    status: PaymentStatus.optional(),
    description: z.string().min(1, "Description cannot be empty").optional(),
  })
  .strict();

export type UpdatePaymentDto = z.infer<typeof UpdatePaymentSchema>;
