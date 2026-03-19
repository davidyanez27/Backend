import z from 'zod';
import { Paginated } from '../shared';
import { CompanySchema } from './company.dto';

export const ListCompaniesSchema = z.object({
  companies: Paginated(CompanySchema)
})

export type ListCompanies = z.infer<typeof ListCompaniesSchema>;
