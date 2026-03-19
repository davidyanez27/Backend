import { prisma } from '../../data/PotsgreSQL/index';
import { PaymentQueryRepository } from '../../../application/repositories';
import { Payment, ListPayments, PaginationQuery } from '@inventory/shared-types';
import { PaymentQueryMapper } from '../../mappers';

const withCompany = { include: { company: { select: { uuid: true } } } } as const;

export class PaymentQueryDatasourceImpl implements PaymentQueryRepository {
    constructor() { }

    async findById(id: string, companyId: number): Promise<Payment | null> {
        const row = await prisma.subscriptionPayment.findFirst({
            where: { uuid: id, companyId },
            ...withCompany,
        });
        if (!row) return null;
        return PaymentQueryMapper.toDto(row);
    }

    async findAll(companyId: number, Pagination: PaginationQuery): Promise<ListPayments> {
        const { page, limit } = Pagination;
        const skip = (page - 1) * limit;

        const [total, rows] = await prisma.$transaction([
            prisma.subscriptionPayment.count({ where: { companyId } }),
            prisma.subscriptionPayment.findMany({
                where: { companyId },
                ...withCompany,
                skip,
                take: limit,
            })
        ]);

        const payments = rows.map((row) => PaymentQueryMapper.toDto(row));

        return {
            payments: {
                data: payments,
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
