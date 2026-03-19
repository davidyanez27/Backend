import { Customer } from '@inventory/shared-types';
import { CustomerRepository } from '../../../../domain/repositories';
import { CustomerEntity } from '../../../../domain/entities';
import { DtoCustomerMapper } from '../../../../presentation/mappers/customer.mapper';

interface CreateCustomerUseCase {
    execute(customer: CustomerEntity): Promise<void>;
}

export class CreateCustomer implements CreateCustomerUseCase {
    constructor(
        private readonly repository: CustomerRepository
    ) { }

    async execute(customer: CustomerEntity): Promise<void> {
        const createdCustomer = await this.repository.add(customer);
        return;
    }
}
