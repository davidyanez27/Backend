import { Payment, ListPayments, PaginationQuery } from '@inventory/shared-types';
import { PaymentQueryRepository } from '../../../application/repositories';
import { PaymentQueryDatasourceImpl } from '../../datasources';

export class PaymentQueryRepositoryImpl implements PaymentQueryRepository {

    constructor (
        private readonly paymentQueryDatasource : PaymentQueryDatasourceImpl,
    ){}
    findById(id: string, companyId: number ): Promise<Payment | null> {
        return this.paymentQueryDatasource.findById( id, companyId);
    }
    findAll(companyId: number, options: PaginationQuery): Promise<ListPayments> {
        return this.paymentQueryDatasource.findAll( companyId, options);
    }
}