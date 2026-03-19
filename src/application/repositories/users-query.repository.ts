import { User, ListUsers, PaginationQuery } from "@inventory/shared-types";

export abstract class UserQueryRepository {
    abstract findById (uuid: string, companyId: number): Promise<User | null>;
    abstract findAll  (companyId: number, options: PaginationQuery): Promise<ListUsers>;
}
