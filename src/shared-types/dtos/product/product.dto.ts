import { z } from "zod";

export const ItemType = z.enum(["PRODUCT" , "SERVICE"]);

export const ProductSchema = z
  .object({
    uuid: z.uuid({ message: "The uuid field must be a valid UUID." }).optional(),
    name: z.string().min(2, "The name field must be at least 2 characters long.").max(100, "The name field must be less than 100 characters."),

    description: z
      .string()
      .max(500, { message: "The description field must be less than 500 characters." }),

    defaultPrice: z.coerce
      .number()
      .refine((n) => Number.isFinite(n) && n >= 0, {
        message: "The defaultPrice field must be a non-negative number.",
    }),
    currency: z.string().min(1, "Currency is required"),
    unit: z.string().min(1, "Unit is required"),
    type: ItemType,
    isActive: z.boolean({ message: "The isActive field must be a boolean." }).optional(),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional(),
  })
  .strict();

export type Product = z.infer<typeof ProductSchema>;
