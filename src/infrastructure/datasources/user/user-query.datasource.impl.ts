import { prisma } from '../../data/PotsgreSQL/index';
import { UserQueryRepository } from '../../../application/repositories';
import { User, ListUsers, PaginationQuery } from '@inventory/shared-types';
import { UserQueryMapper, withMembership } from '../../mappers';

export class UserQueryDatasourceImpl implements UserQueryRepository {
    constructor() { }
    async findById(id: string, companyId: number): Promise<User | null> {
        const row = await prisma.user.findFirst({
            where: {
                uuid: id,
                memberships: {
                    some: {
                        companyId,
                    },
                },
            },
            ...withMembership
        })

        if (!row) return null;
        return UserQueryMapper.toDto(row)
    }

    async findAll(companyId: number, Pagination: PaginationQuery): Promise<ListUsers> {
        const { page, limit } = Pagination;
        const skip = (page - 1) * limit

        const [total, rows] = await prisma.$transaction([
            prisma.user.count({
                where: {
                    memberships: {
                        some: {
                            companyId,
                        },
                    },
                }
            }),
            prisma.user.findMany({
                where: {
                    memberships: {
                        some: {
                            companyId,
                        },
                    },
                },
                skip,
                take: limit,
                ...withMembership
            })
        ]);

        const users = rows.map((user) => { return UserQueryMapper.toDto(user) });

        return {
            users: {
                data: users,
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
