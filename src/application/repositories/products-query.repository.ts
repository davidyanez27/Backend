import { ListProducts, PaginationQuery, Product } from "@inventory/shared-types";

export abstract class ProductQueryRepository {
    abstract findById (uuid: string, companyId: number): Promise<Product | null>;
    abstract findAll  (companyId: number, options: PaginationQuery): Promise<ListProducts>;
    abstract resolveId(uuid: string, companyId: number): Promise<number | null>;
}
