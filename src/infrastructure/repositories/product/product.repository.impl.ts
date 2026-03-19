import { ProductEntity } from '../../../domain/entities';
import { ProductsRepository } from '../../../domain/repositories';
import { ProductDatasourceImpl } from '../../datasources';

export class ProductRepositoryImpl implements ProductsRepository {

    constructor(
        private readonly productsDatasource: ProductDatasourceImpl,
    ) {}

    add(product: ProductEntity): Promise<void> {
        return this.productsDatasource.add(product);
    }
    save(product: ProductEntity): Promise<void> {
        return this.productsDatasource.save(product);
    }
    delete(id: string, companyId: number): Promise<void> {
        return this.productsDatasource.delete(id, companyId);
    }
    getById(id: string, companyId: number): Promise<ProductEntity | null> {
        return this.productsDatasource.getById(id, companyId);
    }
}