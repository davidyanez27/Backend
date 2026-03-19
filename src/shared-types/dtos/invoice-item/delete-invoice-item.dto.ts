import { z } from "zod";

export const DeleteInvoiceItemSchema = z
  .object({
    uuid: z.string().uuid("Invoice item uuid must be a valid UUIDv4"),
  })
  .strict();

export type DeleteInvoiceItemDto = z.infer<typeof DeleteInvoiceItemSchema>;
