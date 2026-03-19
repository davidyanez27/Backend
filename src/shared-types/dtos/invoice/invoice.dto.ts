import { z } from "zod";
import { InvoiceItemSchema } from "../invoice-item";


export const InvoiceStatus = z.enum([
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELED",
]);

export const InvoiceSchema = z
  .object({
    id: z.string().uuid("Invoice id must be a valid UUIDv4"),

    number: z.string().min(1, "Invoice number is required"),
    status: InvoiceStatus,

    currency: z.string().min(1, "Currency is required"),

    issueDate: z.iso.datetime(),
    dueDate: z.iso.datetime().optional(),

    subtotal: z.coerce.number().min(0, "Subtotal must be 0 or greater"),
    tax: z.coerce.number().min(0, "Tax must be 0 or greater"),
    total: z.coerce.number().min(0, "Total must be 0 or greater"),
    discount: z.coerce.number().min(0, "Discount must be 0 or greater"),

    notes: z.string().optional(),

    amountPaid: z.coerce.number().min(0, "Amount paid must be 0 or greater").default(0),
    paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER", "OTHER"]).optional(),
    paymentNotes: z.string().optional(),

    customer: z.string().uuid("Customer must be a valid UUIDv4"),
    customerName: z.string().optional(),
    owner: z.string().uuid("Owner must be a valid UUIDv4"),

    items: z.array(InvoiceItemSchema).default([]),

    pdfUrl: z.string().optional(),

    isActive: z.boolean().default(true),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceStatus = z.infer<typeof InvoiceStatus>;
