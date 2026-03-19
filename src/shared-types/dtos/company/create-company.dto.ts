import { z } from "zod";
import { CompanyTypeEnum } from "./company.dto";

// Minimal required fields for company creation
// Other fields default to "PENDING" and can be updated later
export const CreateCompanySchema = z
  .object({
    name: z.string().min(1, "Company name is required"),
    email: z.string().min(1, "Email is required").email().trim().toLowerCase(),
    country: z.string().min(1, "Country is required"), // ISO 3166-1 alpha-2
    currency: z.string().min(1, "Currency is required"), // ISO 4217
    // Optional fields - will use defaults if not provided
    companyType: CompanyTypeEnum.optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    idType: z.string().optional(),
    idValue: z.string().optional(),
  })
  .strict();

export type CreateCompanyDto = z.infer<typeof CreateCompanySchema>;
