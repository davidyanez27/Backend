import { Company } from '@inventory/shared-types';
import { CompanyEntity } from '../../../../domain/entities';
import { CompanyRepository } from '../../../../domain/repositories';
import { DtoCompanyMapper } from '../../../../presentation/mappers';


interface CreateCompanyUseCase {
    execute(company: CompanyEntity, userId: number): Promise<Company>;
}

export class CreateCompany implements CreateCompanyUseCase {
    constructor(
        private readonly repository: CompanyRepository
    ) { }

    async execute(company: CompanyEntity, userId: number): Promise<Company> {
        await this.repository.add(company, userId);
        return DtoCompanyMapper.ToDto(company);
    }
}