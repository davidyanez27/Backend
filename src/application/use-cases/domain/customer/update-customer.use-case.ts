import { Customer } from '@inventory/shared-types';
import { CustomerRepository } from '../../../../domain/repositories';
import { CustomError } from '../../../errors/customs.error';
import { DtoCustomerMapper } from '../../../../presentation/mappers/customer.mapper';

interface UpdateCustomerUseCase {
    execute(
        id: string,
        companyId: number,
        name?: string,
        billingAddress?: string,
        shippingAddress?: string,
        email?: string,
        phone?: string,
        notes?: string,
    ): Promise<Customer>;
}

export class UpdateCustomer implements UpdateCustomerUseCase {
    constructor(
        private readonly repository: CustomerRepository
    ) { }

    async execute(
        id: string,
        companyId: number,
        name?: string,
        billingAddress?: string,
        shippingAddress?: string,
        email?: string,
        phone?: string,
        notes?: string,
        ): Promise<Customer> {

        const customer = await this.repository.getById(id, companyId);
        if(!customer) throw CustomError.notFound('Customer not found');

        if(name !== undefined) customer.changeName(name);
        if(billingAddress !== undefined) customer.changeBillingAddress(billingAddress);
        if(shippingAddress !== undefined) customer.changeShippingAddress(shippingAddress);
        if(email !== undefined) customer.changeEmail(email);
        if(phone !== undefined) customer.changePhone(phone);
        if(notes !== undefined) customer.changeNotes(notes);

        await this.repository.save(customer);
        return DtoCustomerMapper.ToDto(customer);
    }
}
