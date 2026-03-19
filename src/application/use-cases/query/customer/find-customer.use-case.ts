import { Customer } from "@inventory/shared-types";
import { CustomerQueryRepository } from '../../../repositories';
import { CustomError } from '../../../errors';

interface FindCustomerUseCase {
    execute(uuid: string, companyId: number): Promise<Customer>;
}

export class FindCustomer implements FindCustomerUseCase {
    constructor(
        private readonly repository: CustomerQueryRepository
    ) { }

    async execute(uuid: string, companyId: number): Promise<Customer> {
        const customer = await this.repository.findById(uuid, companyId);
        if (!customer) throw CustomError.notFound("Customer not found");
        return customer;
    }
}
