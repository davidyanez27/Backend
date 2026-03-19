import { Customer, ListCustomers, PaginationQuery } from '@inventory/shared-types';
import { CustomerQueryRepository } from '../../../application/repositories';
import { CustomerQueryDatasourceImpl } from '../../datasources';

export class CustomerQueryRepositoryImpl implements CustomerQueryRepository {

    constructor (
        private readonly customerQueryDatasource : CustomerQueryDatasourceImpl,
    ){}
    findById(uuid: string, companyId: number): Promise<Customer | null> {
        return this.customerQueryDatasource.findById(uuid, companyId);
    }
    findAll(companyId: number, options: PaginationQuery): Promise<ListCustomers> {
        return this.customerQueryDatasource.findAll(companyId, options);
    }
    resolveId(uuid: string, companyId: number): Promise<number | null> {
        return this.customerQueryDatasource.resolveId(uuid, companyId);
    }
}