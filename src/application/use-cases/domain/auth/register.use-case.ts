import { User, Company } from '@inventory/shared-types';
import { UserEntity, CompanyEntity } from '../../../../domain/entities';
import { AuthRepository } from '../../../../domain/repositories';
import { DtoUserMapper } from '../../../../presentation/mappers/user.mapper';
import { DtoCompanyMapper } from '../../../../presentation/mappers/company.mapper';

export interface RegisterResponse {
    user: User;
    company: Company;
}

export interface RegisterWithCompanyUseCase {
    execute(user: UserEntity, company: CompanyEntity): Promise<RegisterResponse>;
}

export class RegisterUserUseCase implements RegisterWithCompanyUseCase {
    constructor(
        private readonly repository: AuthRepository,
    ) { }

    public async execute(user: UserEntity, company: CompanyEntity): Promise<RegisterResponse> {
        await this.repository.registerWithCompany(user, company);

        return {
            user: DtoUserMapper.ToDto(user),
            company: DtoCompanyMapper.ToDto(company),
        };
    }
}
