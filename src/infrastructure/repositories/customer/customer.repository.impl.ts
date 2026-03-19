import { CustomerEntity } from '../../../domain/entities';
import { CustomerRepository } from '../../../domain/repositories';
import { CustomerDatasourceImpl } from '../../datasources';
import { id } from 'zod/v4/locales';


export class CustomerRepositoryImpl implements CustomerRepository {

    constructor (
        private readonly customersDatasource : CustomerDatasourceImpl,
    ){}
    add(customer: CustomerEntity): Promise<void> {
        return this.customersDatasource.add( customer );
    }
    save(customer: CustomerEntity): Promise<void> {
        return this.customersDatasource.save( customer );
    }
    getById(uuid: string, companyId: number): Promise<CustomerEntity | null> {
        return this.customersDatasource.getById( uuid, companyId);
    }
    delete(uuid: string, companyId: number): Promise<void> {
        return this.customersDatasource.delete( uuid, companyId);
    }

}