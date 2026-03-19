import { Product } from '@inventory/shared-types';
import { CustomError } from '../../../errors';
import { ProductQueryRepository } from '../../../repositories';

interface FindProductUseCase {
    execute(uuid: string, companyId: number): Promise<Product>;
}

export class FindProduct implements FindProductUseCase {
    constructor(
        private readonly repository: ProductQueryRepository
    ) { }

    async execute(uuid: string, companyId: number): Promise<Product> {
        const product = await this.repository.findById(uuid, companyId);
        if (!product) throw CustomError.notFound("Product not found");
        return product;
    }
}
