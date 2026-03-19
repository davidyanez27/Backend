import z from 'zod';
import { Paginated } from '../shared';
import { CustomerServiceSchema } from './customer-service.dto';

export const ListCustomerServiceSchema = z.object({
  customerServices: Paginated(CustomerServiceSchema)
})

export type ListCustomerServices = z.infer<typeof ListCustomerServiceSchema>;
