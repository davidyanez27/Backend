import { CompanyRepository } from '../../../../domain/repositories';
import { CustomError } from '../../../errors/customs.error';
import { Company, UpdateCompanyDto } from '@inventory/shared-types';
import { DtoCompanyMapper } from '../../../../presentation/mappers';

interface UpdateCompanyUseCase {
    execute(id: string, companyId: number, userId: number, dto: UpdateCompanyDto): Promise<Company>;
}

export class UpdateCompany implements UpdateCompanyUseCase {
    constructor(
        private readonly repository: CompanyRepository
    ) { }

    async execute(id: string, companyId: number, userId: number, dto: UpdateCompanyDto): Promise<Company> {
        const company = await this.repository.getById(id, companyId);
        if (!company) throw CustomError.notFound('Company not found');

        if (dto.name !== undefined) company.rename(dto.name);
        if (dto.companyType !== undefined) company.changeCompanyType(dto.companyType);
        if (dto.email !== undefined) company.changeEmail(dto.email);
        if (dto.phone !== undefined) company.changePhone(dto.phone);
        if (dto.address !== undefined) company.changeAddress(dto.address);
        if (dto.country !== undefined || dto.currency !== undefined) company.changeCountry(dto.country ?? company.country, dto.currency ?? company.currency);
        if (dto.idType !== undefined && dto.idValue !== undefined) company.changeIdentification(dto.idType, dto.idValue);
        if (dto.logo !== undefined) company.changeLogo(dto.logo);

        await this.repository.save(company, userId);
        return DtoCompanyMapper.ToDto(company);
    }
}
