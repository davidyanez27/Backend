import { CustomerEntity } from "../entities";

export abstract class ProjectRepository {
    abstract add    (customer: CustomerEntity): Promise<void>;
    abstract save   (customer: CustomerEntity): Promise<void>;
    abstract delete (uuid: string, companyId: number): Promise<void>;
    abstract getById(uuid: string, companyId: number): Promise<CustomerEntity | null>;
}
