import { User } from "@inventory/shared-types";
import { UserQueryRepository } from '../../../repositories';
import { CustomError } from '../../../errors';

interface FindUserUseCase {
    execute(uuid: string, companyId: number): Promise<User>;
}

export class FindUser implements FindUserUseCase {
    constructor(
        private readonly repository: UserQueryRepository
    ) { }

    async execute(uuid: string, companyId: number): Promise<User> {
        const user = await this.repository.findById(uuid, companyId);
        if (!user) throw CustomError.notFound("User not found");
        return user;
    }
}
