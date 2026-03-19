import { z } from "zod";

export const DeleteInvoiceSchema = z
  .object({
    uuid: z.string().uuid("Invoice uuid must be a valid UUIDv4"),
  })
  .strict();

export type DeleteInvoiceDto = z.infer<typeof DeleteInvoiceSchema>;
