import { ListCompanies, PaginationQuery } from "@inventory/shared-types";
import { CompanyQueryRepository } from '../../../repositories';

interface FindCompaniesUseCase {
    execute(userId: number, options: PaginationQuery): Promise<ListCompanies>;
}

export class FindCompanies implements FindCompaniesUseCase {
    constructor(
        private readonly repository: CompanyQueryRepository
    ) { }

    execute(userId: number, options: PaginationQuery): Promise<ListCompanies> {
        return this.repository.findAll(userId, options);
    }
}
