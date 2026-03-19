import { InvoiceItem } from '@inventory/shared-types';
import { Prisma } from "@prisma/client";

export const invoiceItemSelect = Prisma.validator<Prisma.InvoiceItemDefaultArgs>()({
  select: {
    id: true,
    uuid: true,
    item: { select: { uuid: true, name: true } },
    description: true,
    quantity: true,
    unitPrice: true,
    discount: true,
    lineTotal: true,
  },
});

export type InvoiceItemRow = Prisma.InvoiceItemGetPayload<typeof invoiceItemSelect>;

export const InvoiceQueryItemMapper = {
  toDto(row: InvoiceItemRow): InvoiceItem {
    const { item, description, quantity, unitPrice, discount, lineTotal} = row;
    return {
      product: item?.uuid ?? undefined,
      description,
      quantity: quantity.toNumber(),
      unitPrice: unitPrice.toNumber(),
      discount: discount.toNumber(),
      lineTotal: lineTotal.toNumber(),
    };
  },
};
