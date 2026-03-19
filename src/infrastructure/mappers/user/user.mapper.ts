
import { UserEntity } from '../../../domain/entities';
import { AppRole } from '../../../domain/types';
import { User, Prisma } from '@prisma/client';



export const UserCommandMapper = {
  fromPrisma(row: User): UserEntity {
    const { uuid, email, emailValidated, password, fullName, isActive, appRole } = row;

    return UserEntity.fromSnapshot({
      id: uuid,
      email,
      emailValidated,
      password: password ?? null,
      fullName,
      appRole: appRole as AppRole,
      isActive,
    });
  },

  toPrismaCreate(entity: UserEntity): Prisma.UserCreateInput {
    const { id, email, emailValidated, password, fullName, isActive, appRole } = entity.snapshot;
    return {
      uuid: id,
      fullName,
      email,
      emailValidated,
      password: password ?? null,
      isActive,
      appRole: appRole as Prisma.UserCreateInput['appRole'],
    };
  },
};
