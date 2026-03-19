import { RegisterDto, User } from '@inventory/shared-types';
import { UserEntity } from '../../domain/entities/user.entity';
import { bcryptAdapter, envs } from '../../config';

export const DtoUserMapper = {
  FromRegisterDto(dto: RegisterDto): UserEntity {
    const { fullName, email, password } = dto;
    const hashedPassword = bcryptAdapter.hash(password);
    const user = UserEntity.createNew({ fullName, email, password: hashedPassword });

    // Assign ADMIN role if email is in ADMIN_EMAILS environment variable
    if (envs.ADMIN_EMAILS.includes(email.toLowerCase())) {
      user.changeAppRole("ADMIN");
    }

    return user;
  },

  ToDto(userEntity: UserEntity): User {
    const { id, fullName, email, isActive, emailValidated, appRole, createdAt, updatedAt } = userEntity.snapshot;
    return {
      uuid: id,
      email,
      fullName,
      appRole,
      isActive,
      emailValidated,
      createdAt: createdAt?.toISOString(),
      updatedAt: updatedAt?.toISOString(),
    };
  }
};
