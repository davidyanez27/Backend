import { InvoiceEntity } from "../entities";

export abstract class InvoiceRepository {
    abstract add    (invoice: InvoiceEntity): Promise<void>;
    abstract save   (invoice: InvoiceEntity): Promise<void>;
    abstract delete (uuid: string, companyId: number): Promise<void>;
    abstract getById(uuid: string, companyId: number): Promise<InvoiceEntity | null>;
}
