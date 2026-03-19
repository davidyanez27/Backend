import { RoleDto } from "@inventory/shared-types";
import { Prisma } from "@prisma/client";

const withCompany = Prisma.validator<Prisma.RoleDefaultArgs>()({
  include: {
    company: { select: { uuid: true } }
  }
});
export type RoleWithCompany = Prisma.RoleGetPayload<typeof withCompany>;

export const RoleQueryMapper = {
  toDto(row: RoleWithCompany): RoleDto {
    const { uuid, name, isSystem, company, createdAt, updatedAt } = row;
    return {
      uuid,
      name,
      isSystem,
      companyId: company.uuid,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  },
};
