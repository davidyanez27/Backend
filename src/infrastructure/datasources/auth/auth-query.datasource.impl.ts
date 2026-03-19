import { prisma } from '../../data/PotsgreSQL/index';
import { AuthQueryRepository } from '../../../application/repositories';
import { AuthIdentity, LoginResponseDto } from '@inventory/shared-types';
import { AuthQueryMapper, withCompany } from '../../mappers';
import { bcryptAdapter } from '../../../config';
import { LRUCache } from 'lru-cache';



const identityCache = new LRUCache<string, AuthIdentity>({ max: 500, ttl: 1000 * 60 * 15 });

export class AuthQueryDatasourceImpl implements AuthQueryRepository {
    constructor() { }

    async getById(id: number, companyId: number): Promise<LoginResponseDto | null> {
        const row = await prisma.user.findUnique({
            where: {
                id,
                memberships: {
                    some: {
                        companyId,
                        isActive: true
                     },
                },
            },
            ...withCompany
        })

        if (!row) return null;
        return AuthQueryMapper.toLoginResponse(row);
    }

    async getByEmail(email: string, password: string): Promise<LoginResponseDto | null> {
        const row = await prisma.user.findUnique({
            where: { email },
            ...withCompany
        });

        if (!row) return null;
        if (!row.memberships.length) return null;

        const isPasswordValid = bcryptAdapter.compare(password, row.password!);
        if (!isPasswordValid) return null;

        return AuthQueryMapper.toLoginResponse(row);
    }

    async resolveIdentity(sub: string, org: string): Promise<AuthIdentity | null> {
        const cacheKey = `${sub}:${org}`;
        const cached = identityCache.get(cacheKey);
        if (cached) return cached;

        const member = await prisma.companyMember.findFirst({
            where: {
                user: { uuid: sub },
                company: { uuid: org },
                isActive: true,
            },
            select: {
                userId: true,
                companyId: true,
                companyRole: true,
                user: { select: { uuid: true, fullName: true, appRole: true } },
                company: { select: { uuid: true, name: true } },
            },
        });

        if (!member) return null;

        const identity: AuthIdentity = {
            userId: member.userId,
            userUuid: member.user.uuid,
            fullName: member.user.fullName,
            appRole: member.user.appRole,
            companyId: member.companyId,
            companyUuid: member.company.uuid,
            companyName: member.company.name,
            companyRole: member.companyRole,
        };

        identityCache.set(cacheKey, identity);
        return identity;
    }
}
