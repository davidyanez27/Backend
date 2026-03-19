import { z } from "zod";

export const UpdateInvoiceItemSchema = z
  .object({
    uuid: z.string().uuid("Invoice item uuid must be a valid UUIDv4"),

    invoice: z.string().uuid("Invoice must be a valid UUIDv4").optional(),
    product: z.string().uuid("Product must be a valid UUIDv4").optional(),

    description: z.string().min(1, "Description cannot be empty").optional(),

    quantity: z.coerce.number().min(0, "Quantity must be 0 or greater").optional(),

    unitPrice: z.coerce.number().min(0, "Unit price must be 0 or greater").optional(),

    lineTotal: z.coerce.number().min(0, "Line total must be 0 or greater").optional(),
  })
  .strict();

export type UpdateInvoiceItemDto = z.infer<typeof UpdateInvoiceItemSchema>;
