import { InvoiceRepository } from '../../../../domain/repositories';
import { CustomError } from '../../../errors/customs.error';

interface DeleteInvoiceUseCase {
    execute(id: string, companyId: number): Promise<void>;
}

export class DeleteInvoice implements DeleteInvoiceUseCase {
    constructor(
        private readonly repository: InvoiceRepository
    ) { }

    async execute(id: string, companyId: number): Promise<void> {
        const invoice = await this.repository.getById(id, companyId);
        if (!invoice) throw CustomError.notFound('Invoice not found');

        if (!invoice.isDraft) {
            throw CustomError.badRequest('Only draft invoices can be deleted');
        }

        await this.repository.delete(id, companyId);
    }
}
