import { PaymentEntity } from '../../../domain/entities';
import { PaymentRepository } from '../../../domain/repositories';
import {  PaymentDatasourceImpl } from '../../datasources';


export class PaymentRepositoryImpl implements PaymentRepository {

    constructor (
        private readonly paymentsDatasource : PaymentDatasourceImpl,
    ){}

    add(payment: PaymentEntity): Promise<void> {
        return this.paymentsDatasource.add( payment );
    }
    save(payment: PaymentEntity): Promise<void> {
        return this.paymentsDatasource.save( payment );
    }
    getById(id: string, companyId: number): Promise<PaymentEntity | null> {
        return this.paymentsDatasource.getById( id, companyId );
    }
    delete(uuid: string, companyId: number): Promise<void> {
        return this.paymentsDatasource.delete( uuid, companyId );
    }

}