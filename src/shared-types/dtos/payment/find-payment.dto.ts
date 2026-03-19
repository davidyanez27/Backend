import z from 'zod';
import { Paginated } from '../shared';
import { PaymentSchema } from './payment.dto';

export const ListPaymentsSchema = z.object({
  payments: Paginated(PaymentSchema)
})

export type ListPayments = z.infer<typeof ListPaymentsSchema>;
