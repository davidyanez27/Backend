import { Invoice } from "@inventory/shared-types";
import { InvoiceQueryRepository } from '../../../repositories';
import { CustomError } from '../../../errors';

interface FindInvoiceUseCase {
    execute(uuid: string, companyId: number): Promise<Invoice>;
}

export class FindInvoice implements FindInvoiceUseCase {
    constructor(
        private readonly repository: InvoiceQueryRepository
    ) { }

    async execute(uuid: string, companyId: number): Promise<Invoice> {
        const invoice = await this.repository.findById(uuid, companyId);
        if (!invoice) throw CustomError.notFound("Invoice not found");
        return invoice;
    }
}
