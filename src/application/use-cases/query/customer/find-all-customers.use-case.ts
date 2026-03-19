import { ListCustomers, PaginationQuery } from "@inventory/shared-types";
import { CustomerQueryRepository } from '../../../repositories';

interface FindCustomersUseCase {
    execute(companyId: number, options: PaginationQuery): Promise<ListCustomers>;
}

export class FindCustomers implements FindCustomersUseCase {
    constructor(
        private readonly repository: CustomerQueryRepository
    ) { }

    execute(companyId: number, options: PaginationQuery): Promise<ListCustomers> {
        return this.repository.findAll(companyId, options);
    }
}
