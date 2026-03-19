import { Money } from "../../../domain/value-objects";
import { ProductEntity } from '../../../domain/entities';
import { Item, Prisma } from "@prisma/client";

export const ProductCommandMapper = {
  fromPrisma(row: Item): ProductEntity {
    const { uuid, name, description, defaultPrice, currency, unit, isActive, type, createdAt, updatedAt, companyId, createdById, updatedById } = row;
    return ProductEntity.fromSnapshot({
      id: uuid,
      name,
      description,
      defaultPrice: Money.create(Number(defaultPrice), currency),
      unit,
      type,
      isActive,
      companyId,
      createdById: createdById ?? null,
      updatedById: updatedById ?? null,
      createdAt,
      updatedAt,
    });
  },

  toPrismaCreate(productEntity: ProductEntity): Prisma.ItemUncheckedCreateInput {
    const { id, name, description, defaultPrice, unit, type, isActive, companyId, createdById, updatedById } = productEntity.snapshot;
    return {
      uuid: id,
      name,
      description,
      defaultPrice: new Prisma.Decimal(defaultPrice.amount),
      currency: defaultPrice.currency,
      unit,
      type: type as Prisma.ItemUncheckedCreateInput['type'],
      isActive,
      companyId,
      createdById: createdById ?? null,
      updatedById: updatedById ?? null,
    };
  },

  toPrismaUpdate(productEntity: ProductEntity): Prisma.ItemUncheckedUpdateInput {
    const { name, description, defaultPrice, unit, type, isActive } = productEntity.snapshot;
    return {
      name,
      description,
      defaultPrice: new Prisma.Decimal(defaultPrice.amount),
      currency: defaultPrice.currency,
      unit,
      type: type as Prisma.ItemUncheckedUpdateInput['type'],
      isActive,
    };
  },
};
