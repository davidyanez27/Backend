import { InvoiceEntity } from '../../../domain/entities';
import { InvoiceRepository } from '../../../domain/repositories';
import { InvoiceDatasourceImpl } from '../../datasources';


export class InvoiceRepositoryImpl implements InvoiceRepository {

    constructor (
        private readonly invoicesDatasource : InvoiceDatasourceImpl,
    ){}
    add(invoice: InvoiceEntity): Promise<void> {
        return this.invoicesDatasource.add( invoice );
    }
    save(invoice: InvoiceEntity): Promise<void> {
        return this.invoicesDatasource.save( invoice );
    }
    getById(id: string, companyId: number): Promise<InvoiceEntity | null> {
        return this.invoicesDatasource.getById(id, companyId);
    }
    delete(uuid: string, companyId: number): Promise<void> {
        return this.invoicesDatasource.delete(uuid, companyId);
    }

}