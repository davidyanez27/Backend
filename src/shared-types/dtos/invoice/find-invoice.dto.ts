import z from 'zod';
import { Paginated } from '../shared';
import { InvoiceSchema } from './invoice.dto';

export const ListInvoiceSchema = z.object({
  invoices: Paginated(InvoiceSchema)
})

export type ListInvoices = z.infer<typeof ListInvoiceSchema>;
