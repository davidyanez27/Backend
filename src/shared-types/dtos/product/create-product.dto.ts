import { z } from "zod";
import { ItemType } from "./product.dto";

export const CreateProductSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Product description is required"),
    defaultPrice: z.coerce.number().min(0, "Default price must be 0 or greater"),
    currency: z.string().min(1, "Currency is required"),
    unit: z.string().min(1, "Unit is required"),
    type: ItemType,
    isActive: z.boolean().optional().default(true),
  })
  .strict();

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
