import { ListProducts, PaginationQuery } from "@inventory/shared-types";
import { ProductQueryRepository } from '../../../repositories';

interface FindProductsUseCase {
    execute(companyId: number, options: PaginationQuery): Promise<ListProducts>;
}

export class FindProducts implements FindProductsUseCase {
    constructor(
        private readonly repository: ProductQueryRepository
    ) { }

    execute(companyId: number, options: PaginationQuery): Promise<ListProducts> {
        return this.repository.findAll(companyId, options);
    }
}
