import z from 'zod';
import { Paginated } from '../shared';
import { InvoiceItemSchema } from './invoice-item.dto';

export const ListInvoiceItemSchema = z.object({
  invoiceItems: Paginated(InvoiceItemSchema)
})

export type ListInvoiceItems = z.infer<typeof ListInvoiceItemSchema>;
