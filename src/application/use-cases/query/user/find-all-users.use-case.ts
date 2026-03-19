import { ListUsers, PaginationQuery } from "@inventory/shared-types";
import { UserQueryRepository } from '../../../repositories';

interface FindUsersUseCase {
    execute(companyId: number, options: PaginationQuery): Promise<ListUsers>;
}

export class FindUsers implements FindUsersUseCase {
    constructor(
        private readonly repository: UserQueryRepository
    ) { }

    execute(companyId: number, options: PaginationQuery): Promise<ListUsers> {
        return this.repository.findAll(companyId, options);
    }
}