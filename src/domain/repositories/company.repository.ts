import { CompanyEntity } from "../entities";

export abstract class CompanyRepository {
    abstract add     (company: CompanyEntity, userId: number): Promise<void>;
    abstract save    (company: CompanyEntity, userId: number): Promise<void>;
    abstract delete  (uuid: string, userId: number): Promise<void>;
    abstract getById (uuid: string, userId: number): Promise<CompanyEntity | null>;
}
