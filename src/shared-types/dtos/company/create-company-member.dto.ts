import z from 'zod';
import { CompanyRoleEnum } from './company-member.dto';

export const CreateCompanyMemberSchema = z
  .object({
    companyId: z.string().uuid("Company id must be a valid UUIDv4"),
    userId: z.string().uuid("User id must be a valid UUIDv4"),
    companyRole: CompanyRoleEnum.default("MEMBER"),
    roleId: z.uuid().nullable().optional(),
  })
  .strict();

export type CreateCompanyMemberDto = z.infer<typeof CreateCompanyMemberSchema>;
