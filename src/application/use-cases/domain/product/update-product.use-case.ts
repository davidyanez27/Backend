import { ProductsRepository } from '../../../../domain/repositories';
import { CustomError } from '../../../errors/customs.error';
import { Money, UserId, ItemType, Unit } from '../../../../domain/value-objects';
import { Product, UpdateProductDto } from '@inventory/shared-types';

export interface UpdateProductInput extends UpdateProductDto {
    companyId: number;
    userId: number;
    fullName: string;
}

interface UpdateProductUseCase {
    execute(input: UpdateProductInput): Promise<Product>;
}

export class UpdateProduct implements UpdateProductUseCase {
    constructor(
        private readonly repository: ProductsRepository
    ) { }

    async execute(input: UpdateProductInput): Promise<Product> {
        const { uuid, companyId, userId, fullName, name, description, defaultPrice, currency, unit, type, isActive } = input;

        const product = await this.repository.getById(uuid, companyId);
        if (!product) throw CustomError.notFound('Product not found');

        if (name !== undefined) product.rename(name);
        if (description !== undefined) product.changeDescription(description);
        if (defaultPrice !== undefined) product.changePrice(Money.create(defaultPrice, currency));
        if (type !== undefined) product.changeType(ItemType.from(type));
        if (unit !== undefined) product.changeUnit(Unit.from(unit));
        if (isActive !== undefined) { isActive ? product.activate() : product.deactivate(); }

        product.setUpdatedBy(new UserId(userId));

        await this.repository.save(product);

        const snapshot = product.snapshot;
        return {
            uuid: snapshot.id,
            name: snapshot.name,
            description: snapshot.description,
            defaultPrice: snapshot.defaultPrice.amount,
            currency: snapshot.defaultPrice.currency,
            unit: snapshot.unit,
            type: snapshot.type,
            isActive: snapshot.isActive,
            updatedBy: fullName,
            createdAt: snapshot.createdAt?.toISOString() || '',
            updatedAt: snapshot.updatedAt?.toISOString() || '',
        };
    }
}
