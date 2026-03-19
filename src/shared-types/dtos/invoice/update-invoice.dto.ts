import { z } from "zod";
import { InvoiceItemSchema } from "../invoice-item";
import { InvoiceStatus } from "./invoice.dto";


export const UpdateInvoiceSchema = z
  .object({
    uuid: z.string().uuid("Invoice uuid must be a valid UUIDv4"),

    number: z.string().min(1, "Invoice number cannot be empty").optional(),
    status: InvoiceStatus.optional(),

    currency: z.string().min(1, "Currency cannot be empty").optional(),

    dueDate: z.iso.datetime().optional(),
    issueDate: z.iso.datetime().optional(),

    subtotal: z.coerce.number().min(0, "Subtotal must be 0 or greater").optional(),
    tax: z.coerce.number().min(0, "Tax must be 0 or greater").optional(),
    total: z.coerce.number().min(0, "Total must be 0 or greater").optional(),
    discount: z.coerce.number().min(0, "Discount must be 0 or greater").optional(),

    notes: z.string().nullable().optional(),

    amountPaid: z.coerce.number().min(0, "Amount paid must be 0 or greater").optional(),
    paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER", "OTHER"]).optional(),
    paymentNotes: z.string().nullable().optional(),

    customer: z.string().uuid("Customer must be a valid UUIDv4").optional(),
    owner: z.string().uuid("Owner must be a valid UUIDv4").optional(),

    items: z.array(InvoiceItemSchema).optional(),

    pdfUrl: z.string().optional(),
  })
  .strict();

export type UpdateInvoiceDto = z.infer<typeof UpdateInvoiceSchema>;
