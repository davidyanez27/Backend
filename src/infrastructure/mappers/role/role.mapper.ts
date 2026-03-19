import { RoleEntity } from '../../../domain/entities';
import { Role, Prisma } from "@prisma/client";


export const RoleCommandMapper = {
  fromPrisma(row: Role): RoleEntity {
    const { uuid, name, isSystem, companyId, createdById, updatedById }:  Prisma.RoleUncheckedCreateInput = row;

    return RoleEntity.fromSnapshot({
      id: uuid,
      name,
      companyId,
      isSystem,
      createdById: createdById ?? null,
      updatedById: updatedById ?? null,
    });
  },

  toPrismaCreate(roleEntity: RoleEntity, companyId: number, createdById?: number | null):  Prisma.RoleUncheckedUpdateInput {
    const role = roleEntity.snapshot;
    const { id, name, isSystem } = role;
    return {
      uuid: id,
      name,
      isSystem,
      companyId,
      createdById: createdById ?? null,
    };
  },
};
