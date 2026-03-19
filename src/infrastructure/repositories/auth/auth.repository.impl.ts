import { UserEntity, CompanyEntity } from '../../../domain/entities';
import { AuthRepository } from '../../../domain/repositories';
import { AuthDatasourceImpl } from '../../datasources';

export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly authDatasource: AuthDatasourceImpl,
    ) { }

    registerWithCompany(user: UserEntity, company: CompanyEntity): Promise<void> {
        return this.authDatasource.registerWithCompany(user, company);
    }

    validateUser(email: string): Promise<void> {
        return this.authDatasource.validateUser(email);
    }
}
