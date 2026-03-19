import { Product, ListProducts, PaginationQuery } from '@inventory/shared-types';
import { ProductQueryRepository } from '../../../application/repositories';
import { ProductQueryDatasourceImpl } from '../../datasources/product/item-query.datasource.impl';

export class ProductQueryRepositoryImpl implements ProductQueryRepository {

    constructor (
        private readonly companysDatasource : ProductQueryDatasourceImpl,
    ){}
    findById(id: string, companyId: number ): Promise<Product | null> {
        return this.companysDatasource.findById( id, companyId);
    }
    findAll(companyId: number, options: PaginationQuery): Promise<ListProducts> {
        return this.companysDatasource.findAll( companyId, options);
    }
    resolveId(uuid: string, companyId: number): Promise<number | null> {
        return this.companysDatasource.resolveId(uuid, companyId);
    }
}