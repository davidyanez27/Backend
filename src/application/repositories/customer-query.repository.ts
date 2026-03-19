import { Customer, ListCustomers, PaginationQuery } from "@inventory/shared-types";

export abstract class CustomerQueryRepository {
    abstract findById (uuid: string, companyId: number): Promise<Customer | null>;
    abstract findAll  (companyId: number, options: PaginationQuery): Promise<ListCustomers>;
    abstract resolveId(uuid: string, companyId: number): Promise<number | null>;
}
