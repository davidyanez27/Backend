import { Company, ListCompanies, PaginationQuery } from '@inventory/shared-types';
import { CompanyQueryRepository } from '../../../application/repositories';
import { CompanyQueryDatasourceImpl } from '../../datasources';

export class CompanyQueryRepositoryImpl implements CompanyQueryRepository {

    constructor (
        private readonly companysDatasource : CompanyQueryDatasourceImpl,
    ){}
    findAll(companyId: number, options: PaginationQuery): Promise<ListCompanies> {
        return this.companysDatasource.findAll( companyId, options);
    }
    findById(uuid: string, userId:number): Promise<Company | null> {
        return this.companysDatasource.findById(uuid, userId);
    }

}