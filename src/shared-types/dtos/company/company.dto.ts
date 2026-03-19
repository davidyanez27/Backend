import { z } from "zod";

export const CompanyTypeEnum = z.enum(["INDIVIDUAL", "BUSINESS", "ENTERPRISE"]);
export type CompanyType = z.infer<typeof CompanyTypeEnum>;

export const CompanySchema = z
  .object({
    id: z.string().uuid("Company id must be a valid UUIDv4"),
    name: z.string().min(1, "Company name is required"),
    companyType: CompanyTypeEnum.default("INDIVIDUAL"),
    idType: z.string().min(1, "Company ID type is required"),
    idValue: z.string().min(1, "ID value is required"),
    currency: z.string().min(1, "Currency is required"),
    address: z.string().min(1, "Address is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().min(1, "Email is required").email().trim().toLowerCase(),
    logo: z.string().nullable().optional(),
    isActive: z.boolean().default(true),
  })
  .strict();

export type Company = z.infer<typeof CompanySchema>;
