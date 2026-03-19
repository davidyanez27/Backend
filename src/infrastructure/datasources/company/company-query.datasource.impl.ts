import { prisma } from '../../data/PotsgreSQL/index';
import { CompanyQueryRepository } from '../../../application/repositories';
import { Company, ListCompanies, PaginationQuery } from '@inventory/shared-types';
import { CompanyQueryMapper } from '../../mappers';


export class CompanyQueryDatasourceImpl implements CompanyQueryRepository {
    constructor() { }

    async findById(id: string, userId: number): Promise<Company | null> {
        const row = await prisma.company.findFirst({
            where: { uuid: id, members: { some: { user: { id: userId } } } },
            include: {
                subscription: { include: { plan: true } },
                members: {
                    include: {
                        user: { select: { uuid: true, fullName: true, email: true } },
                        role: { select: { uuid: true, name: true } }
                    }
                }
            }
        });
        if (!row) return null;
        return CompanyQueryMapper.toDto(row);
    }
    async findAll(userId: number, Pagination: PaginationQuery): Promise<ListCompanies> {
        const { page, limit } = Pagination;
        const skip = (page - 1) * limit

        const [total, rows] = await prisma.$transaction([
            prisma.company.count({ where: { members: { some: { user: { id: userId } } } } }),
            prisma.company.findMany({
                where: { members: { some: { user: { id: userId } } } },
                skip,
                take: limit,
                include: {
                    subscription: { include: { plan: true } },
                    members: {
                        include: {
                            user: { select: { uuid: true, fullName: true, email: true } },
                            role: { select: { uuid: true, name: true } }
                        }
                    }
                }
            })
        ]);

        const companies = rows.map((company) => { return CompanyQueryMapper.toDto(company) });

        return {
            companies: {
                data: companies,
                pagination: {
                    page,
                    limit,
                    total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1,
                }
            },

        }
    }
}