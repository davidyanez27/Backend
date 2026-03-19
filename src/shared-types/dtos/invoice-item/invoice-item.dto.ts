import { z } from "zod";

export const InvoiceItemSchema = z
  .object({
    product: z.string().uuid("Product must be a valid UUIDv4").optional(),
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
    unitPrice: z.coerce.number().min(0, "Unit price must be 0 or greater"),
    discount: z.number().nonnegative("Discount must be 0 or greater").optional().default(0),
    lineTotal: z.number().optional(),
  })
  .strict()
  .transform((item) => ({
    ...item,
    lineTotal: item.lineTotal ?? (item.quantity * item.unitPrice) - item.discount,
  }));

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
