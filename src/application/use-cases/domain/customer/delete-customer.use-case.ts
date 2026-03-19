import { CustomerRepository } from '../../../../domain/repositories';
import { CustomError } from '../../../errors/customs.error';

interface DeleteCustomerUseCase {
    execute(uuid: string, companyId: number): Promise<void>;
}

export class DeleteCustomer implements DeleteCustomerUseCase {
    constructor(
        private readonly repository: CustomerRepository
    ) { }

    async execute(id: string, companyId: number): Promise<void> {
        const customer = await this.repository.getById(id, companyId);
        if (!customer) throw CustomError.notFound('Customer not found');

        if(!customer.snapshot.isActive ) return;

        customer.deactivate()
        await this.repository.save(customer);
    }
}
