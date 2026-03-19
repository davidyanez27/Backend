import { z } from "zod";
import { InvoiceStatus } from "./invoice.dto";
import { InvoiceItemSchema } from "../invoice-item";

export const CreateInvoiceSchema = z
  .object({
    number: z.string().optional(),
    status: InvoiceStatus.optional().default("DRAFT"),

    currency: z.string().min(1, "Currency is required"),

    issueDate: z.iso.datetime(),
    dueDate: z.iso.datetime(),

    tax: z.coerce.number().min(0, "Tax must be 0 or greater"),
    discount: z.coerce.number().min(0, "Discount must be 0 or greater"),

    notes: z.string().optional(),

    customer: z.string().uuid("Customer must be a valid UUIDv4"),

    items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
  })
  .strict();

export type CreateInvoiceDto = z.infer<typeof CreateInvoiceSchema>;
