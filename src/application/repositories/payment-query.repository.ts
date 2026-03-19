import { ListPayments, PaginationQuery, Payment } from "@inventory/shared-types";

export abstract class PaymentQueryRepository {
    abstract findById (uuid: string, companyId: number): Promise<Payment | null>;
    abstract findAll  (companyId: number, options: PaginationQuery): Promise<ListPayments>;
}
