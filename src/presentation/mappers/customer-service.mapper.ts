
import { ProductEntity } from '../../domain/entities';
import { CreateProductDto } from "@inventory/shared-types";
import { Money, CompanyId, Unit, ItemType } from '../../domain/value-objects';


export const DtoCustomerServiceMapper = {
  FromDto(dto: CreateProductDto, companyId: number): ProductEntity {
    const { name, description, defaultPrice, unit, type } = dto;

    return ProductEntity.createNew({
      name: name,
      description: description,
      defaultPrice: Money.create(defaultPrice, "USD"),
      unit: Unit.from(unit),
      type: ItemType.from(type),
      companyId: new CompanyId(companyId),
    })
  },
  ToDto(productEntity: ProductEntity) {
    const { id, name, description, defaultPrice, unit, type, isActive} = productEntity.snapshot;

    return {
      id,
      name,
      description,
      defaultPrice: defaultPrice.amount,
      currency: defaultPrice.currency,
      unit,
      type,
      isActive,
    }
  }
}
