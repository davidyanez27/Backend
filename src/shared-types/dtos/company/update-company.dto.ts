import { z } from "zod";
import { CompanyTypeEnum } from "./company.dto";

export const UpdateCompanySchema = z
  .object({
    uuid: z.string().uuid("Company uuid must be a valid UUID"),
    name: z.string().min(1, "Company name cannot be empty").optional(),
    companyType: CompanyTypeEnum.optional(),
    email: z.string().email("Email must be a valid email").trim().toLowerCase().optional(),
    phone: z.string().min(1, "Phone cannot be empty").optional(),
    address: z.string().min(1, "Address cannot be empty").optional(),
    country: z.string().min(1, "Country cannot be empty").optional(),
    currency: z.string().min(1, "Currency cannot be empty").optional(),
    idType: z.string().min(1, "ID type cannot be empty").optional(),
    idValue: z.string().min(1, "ID value cannot be empty").optional(),
    logo: z.string().nullable().optional(),
  })
  .strict();

export type UpdateCompanyDto = z.infer<typeof UpdateCompanySchema>;
