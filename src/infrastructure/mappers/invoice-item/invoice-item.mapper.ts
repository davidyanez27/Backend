import { InvoiceItemSnapshot } from '../../../domain/types';
import { ProductId } from '../../../domain/value-objects';
import { InvoiceItem, Prisma } from "@prisma/client";

export const InvoiceCommandItemMapper = {
  fromPrisma(row: InvoiceItem): InvoiceItemSnapshot {
    const { itemId, description, quantity, unitPrice, lineTotal } = row;

    return {
      productId: itemId ? new ProductId(itemId) : null,
      description,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      lineTotal: Number(lineTotal),
    };
  },

  toPrismaNestedCreate(snapshot: { productId?: number | null; description: string; quantity: number; unitPrice: number; lineTotal: number }) {
    return {
      itemId: snapshot.productId ?? null,
      description: snapshot.description,
      quantity: new Prisma.Decimal(snapshot.quantity),
      unitPrice: new Prisma.Decimal(snapshot.unitPrice),
      lineTotal: new Prisma.Decimal(snapshot.lineTotal),
    };
  },

  toPrismaCreate(snapshot: { productId?: number | null; description: string; quantity: number; unitPrice: number; lineTotal: number }, invoiceId: number): Prisma.InvoiceItemUncheckedCreateInput {
    return {
      invoiceId,
      itemId: snapshot.productId ?? null,
      description: snapshot.description,
      quantity: new Prisma.Decimal(snapshot.quantity),
      unitPrice: new Prisma.Decimal(snapshot.unitPrice),
      lineTotal: new Prisma.Decimal(snapshot.lineTotal),
    };
  },

  toPrismaUpdate(snapshot: { productId?: number | null; description: string; quantity: number; unitPrice: number; lineTotal: number }): Prisma.InvoiceItemUncheckedUpdateInput {
    return {
      itemId: snapshot.productId ?? null,
      description: snapshot.description,
      quantity: new Prisma.Decimal(snapshot.quantity),
      unitPrice: new Prisma.Decimal(snapshot.unitPrice),
      lineTotal: new Prisma.Decimal(snapshot.lineTotal),
    };
  },
};
