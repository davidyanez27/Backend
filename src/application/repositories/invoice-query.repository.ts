import { Invoice, PaginationQuery, ListInvoices } from "@inventory/shared-types";

export abstract class InvoiceQueryRepository {
    abstract findById (uuid: string, companyId: number): Promise<Invoice | null>;
    abstract findAll  (companyId: number, options: PaginationQuery): Promise<ListInvoices>;
}
