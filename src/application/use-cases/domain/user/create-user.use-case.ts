import { CreateUserDto, User } from '@inventory/shared-types';
import { UserEntity } from '../../../../domain/entities';
import { UserRepository } from '../../../../domain/repositories';
import { DtoUserMapper } from '../../../../presentation/mappers/user.mapper';
import { bcryptAdapter } from '../../../../config';

interface CreateUserUseCase {
    execute(dto: CreateUserDto, companyId: string): Promise<User>;
}

export class CreateUser implements CreateUserUseCase {
    constructor(
        private readonly repository: UserRepository
    ) { }

    async execute(dto: CreateUserDto, companyId: string): Promise<User> {
        const { email, password, fullName } = dto;
        const hashedPassword = bcryptAdapter.hash(password);

        const user = UserEntity.createNew({
            email,
            password: hashedPassword,
            fullName,
        });

        await this.repository.add(user);
        return DtoUserMapper.ToDto(user);
    }
}
