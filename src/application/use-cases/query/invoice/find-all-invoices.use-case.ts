import { ListInvoices, PaginationQuery } from "@inventory/shared-types";
import { InvoiceQueryRepository } from '../../../repositories';

interface FindInvoicesUseCase {
    execute(companyId: number, options: PaginationQuery): Promise<ListInvoices>;
}

export class FindInvoices implements FindInvoicesUseCase {
    constructor(
        private readonly repository: InvoiceQueryRepository
    ) { }

    execute(companyId: number, options: PaginationQuery): Promise<ListInvoices> {
        return this.repository.findAll(companyId, options);
    }
}
