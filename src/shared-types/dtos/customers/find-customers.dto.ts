import z from 'zod';
import { Paginated } from '../shared';
import { CustomerSchema } from './customer.dto';

export const ListCustomersSchema = z.object({
  customers: Paginated(CustomerSchema)
})

export type ListCustomers = z.infer<typeof ListCustomersSchema>;
