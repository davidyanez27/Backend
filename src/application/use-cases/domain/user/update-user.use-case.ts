import { UserRepository } from '../../../../domain/repositories';
import { CustomError } from '../../../errors/customs.error';

interface UpdateUserUseCase {
    execute(id: string, companyId: number, name?: string): Promise<void>;
}

export class UpdateUser implements UpdateUserUseCase {
    constructor(
        private readonly repository: UserRepository
    ) { }

    async execute(id: string, companyId: number, name?: string): Promise<void> {
        const user = await this.repository.getById(id, companyId);
        if(!user) throw CustomError.notFound('User not found');
        if(name !== undefined) user.rename(name);

        await this.repository.save(user);
    }
}
