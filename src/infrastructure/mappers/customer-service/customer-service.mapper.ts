import { Money } from "../../../domain/value-objects";
import { CustomerServiceEntity } from '../../../domain/entities';
import { CustomerItemPrice,Prisma } from "@prisma/client";

export const CustomerItemCommandMapper = {
  fromPrisma(row: CustomerItemPrice): CustomerServiceEntity {
    const { customerId, itemId, customPrice, currency, notes } = row;
    const price = customPrice?.toNumber() ?? 0;
    return CustomerServiceEntity.fromSnapshot({
      customerId,
      productId: itemId,
      customPrice: Money.create(price, currency ?? "USD"),
      notes: notes ?? null,
    });
  },

  toPrismaCreate(entity: CustomerServiceEntity, customerId: number, itemId: number): Prisma.CustomerItemPriceUncheckedCreateInput {
    const snapshot = entity.snapshot;
    return {
      customerId,
      itemId,
      customPrice: new Prisma.Decimal(snapshot.customPrice.amount),
      currency: snapshot.customPrice.currency,
      notes: snapshot.notes,
    };
  },
};
