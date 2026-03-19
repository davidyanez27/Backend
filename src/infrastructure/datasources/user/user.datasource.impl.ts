import { UserEntity } from '../../../domain/entities';
import { UserRepository } from '../../../domain/repositories';
import { prisma } from '../../data/PotsgreSQL';
import { UserCommandMapper, withMembership } from '../../mappers';

export class UserDatasourceImpl implements UserRepository {


    async add(user: UserEntity): Promise<void> {
        const data = UserCommandMapper.toPrismaCreate(user);
        const created = await prisma.user.create({ data });
        const row = await prisma.user.findUniqueOrThrow({ where: { id: created.id }, ...withMembership });
        return;
    }

    async save(user: UserEntity): Promise<void> {
        const data = UserCommandMapper.toPrismaCreate(user);
        await prisma.user.update({ where: { uuid: data.uuid }, data });
        return;
    }

    async getById(id: string, companyId: number): Promise<UserEntity | null> {
        const row = await prisma.user.findFirst({
            where: { uuid: id, memberships: { some: { companyId } } },
            ...withMembership
        });
        if (!row) return null;
        return UserCommandMapper.fromPrisma(row);
    }

    async delete(uuid: string, companyId: number): Promise<void> {
        await prisma.user.delete({
            where: { uuid, memberships: { some: { companyId } } }
        });
    }
}
