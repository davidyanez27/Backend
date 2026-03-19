import { ProductEntity } from "../entities";

export abstract class ProductsRepository {
    abstract add     (product: ProductEntity): Promise<void>;
    abstract save    (product: ProductEntity): Promise<void>;
    abstract delete  (uuid: string, companyId: number): Promise<void>;
    abstract getById (uuid: string, companyId: number): Promise<ProductEntity | null>;
}
