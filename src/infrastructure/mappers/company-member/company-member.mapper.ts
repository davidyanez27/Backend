import { CompanyMemberEntity } from '../../../domain/entities';
import { CompanyMember, Prisma } from "@prisma/client";


export const CompanyMemberCommandMapper = {
  fromPrisma(row: CompanyMember): CompanyMemberEntity {
    const { uuid, companyRole, isActive, companyId, userId, roleId } = row;

    return CompanyMemberEntity.fromSnapshot({
      id: uuid,
      companyId,
      userId,
      companyRole,
      roleId: roleId ?? null,
      isActive,
    });
  },

  toPrismaCreate(entity: CompanyMemberEntity, companyId: number, userId: number, roleId?: number | null) {
    const member = entity.snapshot;
    return {
      uuid: member.id,
      companyRole: member.companyRole as Prisma.CompanyMemberUncheckedCreateInput['companyRole'],
      isActive: member.isActive,
      companyId,
      userId,
      roleId: roleId ?? null,
    };
  },
};
