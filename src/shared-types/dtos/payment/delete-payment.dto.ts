import { z } from "zod";

export const DeletePaymentSchema = z
  .object({
    uuid: z.string().uuid("Payment uuid must be a valid UUIDv4"),
  })
  .strict();

export type DeletePaymentDto = z.infer<typeof DeletePaymentSchema>;
