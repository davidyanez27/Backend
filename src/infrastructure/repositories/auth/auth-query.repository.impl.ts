import { AuthIdentity, LoginResponseDto } from '@inventory/shared-types';
import { AuthQueryRepository } from '../../../application';
import { AuthQueryDatasourceImpl } from '../../datasources';


export class AuthQueryRepositoryImpl implements AuthQueryRepository {

    constructor (
        private readonly authDatasource : AuthQueryDatasourceImpl,
    ){}

    getById(id: number, companyId: number): Promise<LoginResponseDto | null> {
        return this.authDatasource.getById(id, companyId);
    }

    getByEmail(email: string, password: string): Promise<LoginResponseDto | null> {
        return this.authDatasource.getByEmail(email, password);
    }

    resolveIdentity(sub: string, org: string): Promise<AuthIdentity | null> {
        return this.authDatasource.resolveIdentity(sub, org);
    }
}
