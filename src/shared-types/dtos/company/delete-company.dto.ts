import { z } from "zod";

export const DeleteCompanySchema = z
  .object({
    uuid: z.string().uuid("Company uuid must be a valid UUIDv4"),
  })
  .strict();

export type DeleteCompanyDto = z.infer<typeof DeleteCompanySchema>;
