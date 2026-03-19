import { Company } from "@inventory/shared-types";
import { CompanyQueryRepository } from '../../../repositories';
import { CustomError } from '../../../errors';

interface FindCompanyUseCase {
    execute(id: string, userId: number): Promise<Company>;
}

export class FindCompany implements FindCompanyUseCase {
    constructor(
        private readonly repository: CompanyQueryRepository
    ) { }

    async execute(id: string, userId: number): Promise<Company> {
        const company = await this.repository.findById(id, userId);
        if (!company) throw CustomError.notFound("Company not found");
        return company;
    }
}
