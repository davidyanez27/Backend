import z from 'zod';
import { Paginated } from '../shared';
import { ProductSchema } from './product.dto';

export const ListProductsSchema = z.object({
  products: Paginated(ProductSchema)
})

export type ListProducts = z.infer<typeof ListProductsSchema>;
