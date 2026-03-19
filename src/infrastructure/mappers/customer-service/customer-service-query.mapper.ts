import { CreateCustomerServiceDto } from "@inventory/shared-types";
import { Prisma } from "@prisma/client";

const withRelations = Prisma.validator<Prisma.CustomerItemPriceDefaultArgs>()({
  include: {
    item: { select: { uuid: true, name: true } },
    customer: { select: { uuid: true, name: true } },
  },
});
export type CustomerItemPriceWithRelations = Prisma.CustomerItemPriceGetPayload<typeof withRelations>;

export const CustomerItemQueryMapper = {
  toDto(row: CustomerItemPriceWithRelations): CreateCustomerServiceDto {
    const {  customer, item, customPrice, currency, notes } = row;
    return {
      customer: customer.uuid,
      product: item.uuid,
      customPrice: customPrice?.toNumber() ?? 0,
      currency: currency ?? "USD",
      notes: notes ?? "",
    };
  },
};
