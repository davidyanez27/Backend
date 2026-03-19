import { z } from "zod";
import { ProductSchema } from "../product";

export const CustomerServiceSchema = z
  .object({
    id: z.string().uuid("CustomerService id must be a valid UUIDv4"),

    customer: z.string().uuid("Customer must be a valid UUIDv4"),
    product: ProductSchema,

    owner: z.string().uuid("Owner must be a valid UUIDv4"),

    customPrice: z.coerce.number().min(0, "Custom price must be 0 or greater"),

    currency: z.string().min(1, "Currency is required"),

    notes: z.string().optional(),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export type CustomerService = z.infer<typeof CustomerServiceSchema>;
