import { UserEntity, CompanyEntity, CompanyMemberEntity, CustomerEntity } from '../../../domain/entities';
import { AuthRepository } from '../../../domain/repositories';
import { prisma } from '../../data/PotsgreSQL';
import { UserCommandMapper, CompanyCommandMapper, CompanyMemberCommandMapper, CustomerCommandMapper } from '../../mappers';
import { CompanyId } from '../../../domain/value-objects';

export class AuthDatasourceImpl implements AuthRepository {



    async registerWithCompany(user: UserEntity, company: CompanyEntity): Promise<void> {

        await prisma.$transaction(async (tx) => {
            const userData = UserCommandMapper.toPrismaCreate(user);
            const createdUser = await tx.user.create({ data: userData });

            const companyData = CompanyCommandMapper.toPrismaCreate(company);
            const createdCompany = await tx.company.create({ data: companyData });

            const membership = CompanyMemberEntity.createOwner(createdCompany.id, createdUser.id);
            const membershipData = CompanyMemberCommandMapper.toPrismaCreate(membership, createdCompany.id, createdUser.id);
            await tx.companyMember.create({ data: membershipData });

            const walkInCustomer = CustomerEntity.createWalkIn({ companyId: new CompanyId(createdCompany.id) });
            const customerData = CustomerCommandMapper.toPrismaCreate(walkInCustomer);
            await tx.customer.create({ data: customerData });
        });

        return;
    }

    async validateUser(email: string): Promise<void> {
        await prisma.user.update({
            where: { email },
            data: { emailValidated: true },
        });
        return;
    }
}
