import { z } from "zod";
import { ItemType } from "./product.dto";

export const UpdateProductSchema = z
  .object({
    uuid: z.string().uuid("Product uuid must be a valid UUIDv4"),

    name: z.string().min(1, "Product name cannot be empty").optional(),
    description: z.string().min(1, "Product description cannot be empty").optional(),
    unit: z.string().min(1, "Unit cannot be empty").optional(),
    currency: z.string().min(1, "Currency is required"),
    defaultPrice: z.coerce.number().nonnegative("Default price must be 0 or greater").optional(),
    type: ItemType,
    isActive: z.boolean().optional(),
  })
  .strict();

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
