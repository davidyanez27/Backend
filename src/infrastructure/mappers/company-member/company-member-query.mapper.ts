import { Prisma } from "@prisma/client";
import { CompanyMemberDto } from "@inventory/shared-types";

const withRelations = Prisma.validator<Prisma.CompanyMemberDefaultArgs>()({
  include: {
    company: { select: { uuid: true, name: true } },
    user: { select: { uuid: true, fullName: true, email: true } },
    role: { select: { uuid: true, name: true } }
  }
});
export type CompanyMemberWithRelations = Prisma.CompanyMemberGetPayload<typeof withRelations>;

export const CompanyMemberQueryMapper = {
  toDto(row: CompanyMemberWithRelations): CompanyMemberDto {
    const { uuid, companyRole, isActive, company, user, role } = row;

    return {
      id: uuid,
      companyId: company.uuid,
      userId: user.uuid,
      companyRole,
      roleId: role?.uuid ?? null,
      isActive,
    };
  },
};
