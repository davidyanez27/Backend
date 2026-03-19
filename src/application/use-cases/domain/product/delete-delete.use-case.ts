import { ProductsRepository } from '../../../../domain/repositories';
import { CustomError } from '../../../errors/customs.error';

interface DeleteProductUseCase {
    execute(id: string, companyId: number): Promise<void>;
}

export class DeleteProduct implements DeleteProductUseCase {
    constructor(
        private readonly repository: ProductsRepository
    ) { }

    async execute(id: string, companyId: number): Promise<void> {
        const Product = await this.repository.getById(id, companyId);
        if (!Product) throw CustomError.notFound('Product not found');

        if(!Product.snapshot.isActive) return
        Product.deactivate()
        await this.repository.save(Product);
    }
}
