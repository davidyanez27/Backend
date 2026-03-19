import { Company, ListCompanies, PaginationQuery } from "@inventory/shared-types";

export abstract class CompanyQueryRepository {
    abstract findById (uuid: string, userId: number): Promise<Company | null>;
    abstract findAll  (userId: number, options: PaginationQuery): Promise<ListCompanies>;
}
