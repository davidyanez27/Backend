import { UserEntity, CompanyEntity } from "../entities";

export abstract class AuthRepository {
    abstract registerWithCompany( user: UserEntity, company: CompanyEntity): Promise<void>;
    abstract validateUser(email: string): Promise<void>;
}
