import { User, AppRole, LoginResponseDto, CompanyType } from '@inventory/shared-types';
import { Prisma } from '@prisma/client';

export const withCompany= Prisma.validator<Prisma.UserDefaultArgs>()({
    include: {
        memberships: {
            select: {
                uuid: true,
                companyRole: true,
                isActive: true,
                company: {
                    select: {
                        uuid: true,
                        name: true,
                        companyType: true,
                        idType: true,
                        idValue: true,
                        email: true,
                        phone: true,
                        address: true,
                        country: true,
                        currency: true,
                        logo: true,
                        isActive: true,
                    }
                },
                role: { select: { uuid: true, name: true } }
            }
        }
    },
});

export type AuthWithCompany = Prisma.UserGetPayload<typeof withCompany>;

export const AuthQueryMapper = {

  toDto(row: AuthWithCompany): User {
    const { uuid, email, fullName, isActive, emailValidated, appRole, createdAt, updatedAt } = row;
    return {
      uuid,
      fullName,
      email,
      appRole: appRole as AppRole,
      isActive,
      emailValidated,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  },

  toLoginResponse(row: AuthWithCompany): LoginResponseDto {
    const user = this.toDto(row);
    const ownerMembership = row.memberships.find(m => m.companyRole === 'OWNER');
    const { company } = ownerMembership ?? row.memberships[0];

    return {
      user,
      company: {
        id: company.uuid,
        name: company.name,
        companyType: company.companyType as CompanyType,
        idType: company.idType,
        idValue: company.idValue,
        email: company.email,
        phone: company.phone,
        address: company.address,
        country: company.country,
        currency: company.currency,
        logo: company.logo ?? null,
        isActive: company.isActive,
      },
    };
  },
};
