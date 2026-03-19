import { CreateProductDto, Product } from '@inventory/shared-types';
import { ProductEntity } from '../../../../domain/entities';
import { ProductsRepository } from '../../../../domain/repositories';
import { Money, CompanyId, UserId, Unit, ItemType } from '../../../../domain/value-objects';

export interface CreateProductInput extends CreateProductDto {
    companyId: number;
    userId: number;
    fullName: string;
}

interface CreateProductUseCase {
    execute(input: CreateProductInput): Promise<Product>;
}

export class CreateProduct implements CreateProductUseCase {
    constructor(
        private readonly repository: ProductsRepository
    ) { }

    async execute(input: CreateProductInput): Promise<Product> {
        const { name, description, defaultPrice, unit, type, companyId, userId, fullName } = input;

        const product = ProductEntity.createNew({
            name,
            description,
            defaultPrice: Money.create(defaultPrice, "USD"),
            unit: Unit.from(unit),
            type: ItemType.from(type),
            companyId: new CompanyId(companyId),
            createdById: new UserId(userId),
            updatedById: new UserId(userId),
        });

        await this.repository.add(product);

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
            createdBy: fullName,
        };
    }
}
