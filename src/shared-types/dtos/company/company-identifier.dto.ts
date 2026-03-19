import { z } from "zod";

export const CompanyIdentifierSchema = z
  .object({
    type: z.string().min(1, "Identifier type is required"),
    value: z.string().min(1, "Identifier value is required"),
    country: z.string().min(1, "Country value cannot be empty").optional(),
    isPrimary: z.boolean().optional(),
  })
  .strict();

export type CompanyIdentifier = z.infer<typeof CompanyIdentifierSchema>;
