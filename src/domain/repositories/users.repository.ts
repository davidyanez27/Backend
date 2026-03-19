import { UserEntity } from "../entities";

export abstract class UserRepository {
    abstract add        (user: UserEntity): Promise<void>;
    abstract save       (user: UserEntity): Promise<void>;
    abstract delete     (uuid: string, companyId: number): Promise<void>;
    abstract getById    (uuid: string, companyId: number): Promise<UserEntity | null>;

}
