import { prisma } from '../../data/PotsgreSQL/index';
import { InvoiceQueryRepository } from '../../../application/repositories';
import { Invoice, ListInvoices, PaginationQuery } from '@inventory/shared-types';
import { InvoiceQueryMapper, withInvoiceRelations } from '../../mappers';

export class InvoiceQueryDatasourceImpl implements InvoiceQueryRepository {
    constructor() { }

    async findById(uuid: string, companyId: number): Promise<Invoice | null> {
        const row = await prisma.invoice.findFirst({
            where: { uuid, companyId },
            ...withInvoiceRelations
        });
        if (!row) return null;
        return InvoiceQueryMapper.toDto(row);
    }

    async findAll(companyId: number, Pagination: PaginationQuery): Promise<ListInvoices> {
        const { page, limit } = Pagination;
        const skip = (page - 1) * limit;

        const [total, rows] = await prisma.$transaction([
            prisma.invoice.count({ where: { companyId } }),
            prisma.invoice.findMany({
                where: { companyId },
                skip,
                take: limit,
                ...withInvoiceRelations
            })
        ]);

        const invoices = rows.map((invoice) => InvoiceQueryMapper.toDto(invoice));

        return {
            invoices: {
                data: invoices,
                pagination: {
                    page,
                    limit,
                    total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1,
                }
            },
        };
    }
}