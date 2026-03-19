import { InvoiceRepository } from '../../../../domain/repositories';
import { CustomError } from '../../../errors/customs.error';
import type { UpdateInvoiceDto } from '@inventory/shared-types';

interface UpdateInvoiceUseCase {
    execute(id: string, companyId: number, dto: UpdateInvoiceDto): Promise<void>;
}

export class UpdateInvoice implements UpdateInvoiceUseCase {
    constructor(
        private readonly repository: InvoiceRepository
    ) { }

    async execute(id: string, companyId: number, dto: UpdateInvoiceDto): Promise<void> {
        const invoice = await this.repository.getById(id, companyId);
        if (!invoice) throw CustomError.notFound('Invoice not found');

        if (invoice.isPaid || invoice.isCanceled) {
            throw CustomError.badRequest('Cannot update a paid or canceled invoice');
        }

        // Apply field updates before status change (ensureMutable check runs while still in original status)
        if (dto.notes !== undefined) invoice.updateNotes(dto.notes ?? null);

        if (dto.status !== undefined && dto.status !== invoice.status) {
            switch (dto.status) {
                case 'SENT':           invoice.markAsSent(); break;
                case 'OVERDUE':
                    if (!invoice.dueDate) throw CustomError.badRequest('Cannot mark as overdue without a due date');
                    if (invoice.dueDate.getTime() >= Date.now()) throw CustomError.badRequest('Cannot mark as overdue before the due date');
                    invoice.markAsOverdue();
                    break;
                case 'CANCELED':       invoice.markAsCanceled(); break;
                case 'PAID':           invoice.applyPayment(invoice.total); break;
                case 'PARTIALLY_PAID': {
                    const amount = dto.amountPaid;
                    if (amount === undefined || amount <= 0) throw CustomError.badRequest('Amount paid is required for partial payment');
                    if (amount >= invoice.total) throw CustomError.badRequest('Amount paid must be less than the total for a partial payment');
                    invoice.applyPayment(amount);
                    break;
                }
                case 'DRAFT':
                    throw CustomError.badRequest('Cannot revert an invoice back to draft');
            }
        }

        if (dto.paymentMethod !== undefined) invoice.updatePaymentMethod(dto.paymentMethod);
        if (dto.paymentNotes !== undefined) invoice.updatePaymentNotes(dto.paymentNotes ?? null);
        if (dto.amountPaid !== undefined) {
            invoice.updateAmountPaid(dto.amountPaid);
            invoice.applyPayment(dto.amountPaid);
        }

        await this.repository.save(invoice);
    }
}
