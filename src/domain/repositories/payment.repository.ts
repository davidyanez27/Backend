import { PaymentEntity } from "../entities";

export abstract class PaymentRepository {
    abstract add     (payment: PaymentEntity): Promise<void>;
    abstract save    (payment: PaymentEntity): Promise<void>;
    abstract delete  (uuid: string, companyId: number): Promise<void>;
    abstract getById (uuid: string, companyId: number): Promise<PaymentEntity | null>;
}
