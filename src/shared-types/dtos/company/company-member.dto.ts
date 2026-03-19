import { z } from "zod";

export const CompanyRoleEnum = z.enum(["OWNER", "ADMIN", "MEMBER"]);
export type CompanyRole = z.infer<typeof CompanyRoleEnum>;

export const CompanyMemberSchema = z
  .object({
    id: z.string().uuid("Member id must be a valid UUIDv4"),
    companyId: z.string().uuid("Company id must be a valid UUIDv4"),
    userId: z.string().uuid("User id must be a valid UUIDv4"),
    companyRole: CompanyRoleEnum,
    roleId: z.uuid().nullable().optional(),
    isActive: z.boolean().default(true),
  })
  .strict();

export type CompanyMemberDto = z.infer<typeof CompanyMemberSchema>;
