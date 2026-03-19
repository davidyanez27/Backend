import { User, ListUsers, PaginationQuery } from '@inventory/shared-types';
import { UserQueryRepository } from '../../../application/repositories';
import { UserQueryDatasourceImpl } from '../../datasources';

export class UserQueryRepositoryImpl implements UserQueryRepository {

    constructor (
        private readonly companysDatasource : UserQueryDatasourceImpl,
    ){}
    findById(id: string, companyId: number ): Promise<User | null> {
        return this.companysDatasource.findById( id, companyId);
    }
    findAll(companyId: number, options: PaginationQuery): Promise<ListUsers> {
        return this.companysDatasource.findAll( companyId, options);
    }
}