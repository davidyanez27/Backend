import { prisma } from '../../data/PotsgreSQL/index';
import { ProductQueryRepository } from '../../../application/repositories';
import { Product, ListProducts, PaginationQuery } from '@inventory/shared-types';
import { ProductQueryMapper, withProductRelations } from '../../mappers';
import { LRUCache } from 'lru-cache';

const productIdCache = new LRUCache<string, number>({ max: 1000, ttl: 1000 * 60 * 15 });

export class ProductQueryDatasourceImpl implements ProductQueryRepository {
    constructor() { }

    async resolveId(uuid: string, companyId: number): Promise<number | null> {
        const cacheKey = `${uuid}:${companyId}`;
        const cached = productIdCache.get(cacheKey);
        if (cached) return cached;

        const row = await prisma.item.findFirst({
            where: { uuid, companyId },
            select: { id: true },
        });
        if (!row) return null;

        productIdCache.set(cacheKey, row.id);
        return row.id;
    }

    async findById(id: string, companyId: number): Promise<Product | null> {
        const row = await prisma.item.findFirst({
            where: { uuid: id, companyId },
            ...withProductRelations,
        });
        if (!row) return null;
        return ProductQueryMapper.toDto(row);
    }

    async findAll(companyId: number, Pagination: PaginationQuery): Promise<ListProducts> {
        const { page, limit } = Pagination;
        const skip = (page - 1) * limit;

        const [total, rows] = await prisma.$transaction([
            prisma.item.count({ where: { companyId } }),
            prisma.item.findMany({
                where: { companyId },
                ...withProductRelations,
                skip,
                take: limit,
            })
        ]);

        const products = rows.map((product) => ProductQueryMapper.toDto(product));

        return {
            products: {
                data: products,
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
