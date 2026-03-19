import { InvoiceEntity } from '../../../../domain/entities';
import { InvoiceRepository } from '../../../../domain/repositories';
import { CustomerQueryRepository, ProductQueryRepository } from '../../../repositories';
import { CustomError } from '../../../errors/customs.error';
import { CreateInvoiceDto } from '@inventory/shared-types';
import { CompanyId, CustomerId, ProductId, UserId } from '../../../../domain/value-objects';

interface CreateInvoiceUseCase {
    execute(dto: CreateInvoiceDto, companyId: number, userId: number): Promise<void>;
}

export class CreateInvoice implements CreateInvoiceUseCase {
    constructor(
        private readonly repository: InvoiceRepository,
        private readonly customerQueryRepository: CustomerQueryRepository,
        private readonly productQueryRepository: ProductQueryRepository,
    ) { }

    async execute(dto: CreateInvoiceDto, companyId: number, userId: number): Promise<void> {
        const customerId = await this.customerQueryRepository.resolveId(dto.customer, companyId);
        if (!customerId) throw CustomError.notFound("Customer not found");

        const resolvedItems = await Promise.all(
            dto.items.map(async (item) => {
                let productId: ProductId | null = null;
                if (item.product) {
                    const numericId = await this.productQueryRepository.resolveId(item.product, companyId);
                    if (!numericId) throw CustomError.notFound(`Product not found: ${item.product}`);
                    productId = new ProductId(numericId);
                }
                return {
                    productId,
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    lineTotal: item.lineTotal,
                };
            })
        );

        const invoice = InvoiceEntity.createNew({
            number: dto.number || 'PENDING',
            status: dto.status,
            currency: dto.currency,
            issueDate: new Date(dto.issueDate),
            dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            tax: dto.tax,
            discount: dto.discount,
            notes: dto.notes,
            customerId: new CustomerId(customerId),
            companyId: new CompanyId(companyId),
            items: resolvedItems,
            createdById: new UserId(userId),
            updatedById: new UserId(userId),
        });

        await this.repository.add(invoice);
    }
}
