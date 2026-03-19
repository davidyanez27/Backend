import { z } from "zod";

export const BasePagination = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
  hasNext: z.boolean().nullable().optional(),
  hasPrev: z.boolean().nullable().optional(),
}).strict();


export const SortOrder = z.enum(["asc", "desc"]);
export const Status = z.enum(["active", "inactive"]);

export const PaginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.string().optional(),
  sortOrder: SortOrder.optional().default("asc"),
  status: Status.optional().default("active"),
}).strict();

export const Paginated = <T extends z.ZodTypeAny>(Item: T) =>
  z.object({
    data: z.array(Item),
    pagination: BasePagination,
}).strict();

export type BasePagination = z.infer<typeof BasePagination>;
export type PaginationQuery = z.infer<typeof PaginationQuery>;
export type Paginated<T extends z.ZodType> = z.infer<ReturnType<typeof Paginated<T>>>;

export type SortOrder = z.infer<typeof SortOrder>;
export type Status = z.infer<typeof Status>;
