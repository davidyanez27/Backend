import { User, AppRole } from '@inventory/shared-types';
import { Prisma } from '@prisma/client';

export const withMembership = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: {
        memberships: {
            select: {
                uuid: true,
                companyRole: true,
                isActive: true,
                company: { select: { uuid: true, id: true, name: true } },
                role: { select: { uuid: true, name: true } }
            }
        }
    },
});

export type UserWithRelations = Prisma.UserGetPayload<typeof withMembership>;

export const UserQueryMapper = {


  toDto(row: UserWithRelations): User {
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
};
