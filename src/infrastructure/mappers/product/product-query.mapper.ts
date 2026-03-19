import { Product } from "@inventory/shared-types";
import { Prisma } from "@prisma/client";

export const withProductRelations = Prisma.validator<Prisma.ItemDefaultArgs>()({
  include: {
    company: { select: { uuid: true, subscription:{select:{status:true}} } },
    createdBy: { select: { uuid: true, fullName: true } },
    updatedBy: { select: { uuid: true, fullName: true } },
  }
});
export type ProductWithRelations = Prisma.ItemGetPayload<typeof withProductRelations>;

export const ProductQueryMapper = {
  toDto(row: ProductWithRelations): Product {
    const { uuid, name, currency, description, defaultPrice, type, unit, isActive, createdBy, updatedBy, createdAt, updatedAt } = row;
    return {
      uuid,
      name,
      description,
      defaultPrice: defaultPrice.toNumber(),
      currency,
      unit,
      type,
      isActive,
      createdBy: createdBy?.fullName,
      updatedBy: updatedBy?.fullName,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  },
};
