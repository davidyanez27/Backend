import { prisma } from '../../data/PotsgreSQL/index';
import { CustomerQueryRepository } from '../../../application/repositories';
import { Customer, ListCustomers, PaginationQuery } from '@inventory/shared-types';
import { CustomerQueryMapper, withCustomerRelations } from '../../mappers';
import { LRUCache } from 'lru-cache';

const customerIdCache = new LRUCache<string, number>({ max: 1000, ttl: 1000 * 60 * 15 });

export class CustomerQueryDatasourceImpl implements CustomerQueryRepository {

    async resolveId(uuid: string, companyId: number): Promise<number | null> {
        const cacheKey = `${uuid}:${companyId}`;
        const cached = customerIdCache.get(cacheKey);
        if (cached) return cached;

        const row = await prisma.customer.findFirst({
            where: { uuid, companyId },
            select: { id: true },
        });
        if (!row) return null;

        customerIdCache.set(cacheKey, row.id);
        return row.id;
    }

    async findById(id: string, companyId: number): Promise<Customer | null> {
        const row = await prisma.customer.findFirst({ where: { uuid: id, companyId }, ...withCustomerRelations });
        if (!row) return null;
        return CustomerQueryMapper.toDto(row);
    }

    async findAll(companyId: number, Pagination: PaginationQuery): Promise<ListCustomers> {
        const { page, limit } = Pagination;
        const skip = (page - 1) * limit;

        const [total, rows] = await prisma.$transaction([
            prisma.customer.count({ where: { companyId } }),
            prisma.customer.findMany({ where: { companyId }, ...withCustomerRelations, skip, take: limit })
        ]);

        const customers = rows.map((customer) => CustomerQueryMapper.toDto(customer));

        return {
            customers: {
                data: customers,
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
