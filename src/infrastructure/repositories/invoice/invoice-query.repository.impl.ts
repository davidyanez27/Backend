import { Invoice, ListInvoices, PaginationQuery } from '@inventory/shared-types';
import { InvoiceQueryRepository } from '../../../application/repositories';
import { InvoiceQueryDatasourceImpl } from '../../datasources';


export class InvoiceQueryRepositoryImpl implements InvoiceQueryRepository {

    constructor (
        private readonly invoiceQueryDatasource : InvoiceQueryDatasourceImpl,
    ){}
    findById(uuid: string, companyId: number): Promise<Invoice | null> {
        return this.invoiceQueryDatasource.findById(uuid, companyId);
    }
    findAll(companyId: number, options: PaginationQuery): Promise<ListInvoices> {
        return this.invoiceQueryDatasource.findAll(companyId, options);
    }
}