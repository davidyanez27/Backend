import { CompanyEntity } from '../../../domain/entities';
import { CompanyRepository } from '../../../domain/repositories';
import { CompanyCommandMapper } from '../../mappers';
import { prisma } from '../../data/PotsgreSQL/index';

export class CompanyDatasourceImpl implements CompanyRepository {

    constructor() { }

    async add(company: CompanyEntity, userId: number): Promise<void> {
        const data = CompanyCommandMapper.toPrismaCreate(company);

        await prisma.company.create({
            data: {
                ...data,
                members: {
                    create: [
                        {
                            companyRole: "OWNER",
                            user: { connect: { id: userId } }
                        }
                    ]
                }
            },
        });
    }

    async save(company: CompanyEntity, userId: number): Promise<void> {
        const data = CompanyCommandMapper.toPrismaCreate(company);
        const { uuid } = data;

        await prisma.company.update({
            where: {
                uuid,
                members: {
                    some: {
                        userId,
                        companyRole: "OWNER"
                    },
                }
            },
            data,
        });
    }

    async delete(uuid: string, userId: number): Promise<void> {
        await prisma.company.delete({
            where: {
                uuid,
                members: {
                    some: {
                        userId,
                        companyRole: "OWNER"
                    },
                }
            },
        });
    }

    async getById(uuid: string, userId: number): Promise<CompanyEntity | null> {
        const row = await prisma.company.findFirst({
            where: {
                uuid,
                members: {
                    some: {
                        user: { id: userId }
                    },
                }
            },
        });

        if (!row) return null;
        return CompanyCommandMapper.fromPrisma(row);
    }
}
