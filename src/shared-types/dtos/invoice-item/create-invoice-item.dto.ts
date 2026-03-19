import { z } from "zod";

export const CreateInvoiceItemSchema = z
  .object({
    invoice: z.string().uuid("Invoice must be a valid UUIDv4"),

    product: z.string().uuid("Product must be a valid UUIDv4").optional(),
    description: z.string().min(1, "Description is required"),

    quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
    unitPrice: z.coerce.number().min(0, "Unit price must be 0 or greater"),
    discount: z.number().nonnegative("Discount must be 0 or greater").optional().default(0),

    lineTotal: z.coerce.number().min(0, "Line total must be 0 or greater"),
  })
  .strict();

export type CreateInvoiceItemDto = z.infer<typeof CreateInvoiceItemSchema>;
