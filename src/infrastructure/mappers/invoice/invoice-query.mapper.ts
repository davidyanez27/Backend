import { Invoice } from '@inventory/shared-types';
import { Prisma } from "@prisma/client";
import { InvoiceQueryItemMapper } from '../invoice-item/invoice-item-query.mapper';

export const withInvoiceRelations = Prisma.validator<Prisma.InvoiceDefaultArgs>()({
  include: {
    customer: { select: { uuid: true, name: true } },
    company: { select: { uuid: true } },
    items: {
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
    },
  },
});
export type InvoiceWithRelationsQuery = Prisma.InvoiceGetPayload<typeof withInvoiceRelations>;

export const InvoiceQueryMapper = {
  toDto(row: InvoiceWithRelationsQuery): Invoice {
    const { uuid, number, status, currency, issueDate, dueDate, subtotal, tax, total, discount, notes, amountPaid, paymentMethod, paymentNotes, customer, company, items, pdfUrl, isActive, createdAt, updatedAt } = row;
    return {
      id: uuid,
      number,
      status,
      currency,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate?.toISOString(),
      subtotal: subtotal.toNumber(),
      tax: tax.toNumber(),
      total: total.toNumber(),
      discount: discount.toNumber(),
      notes: notes ?? undefined,
      amountPaid: amountPaid.toNumber(),
      paymentMethod: paymentMethod ?? undefined,
      paymentNotes: paymentNotes ?? undefined,
      customer: customer.uuid,
      customerName: customer.name,
      owner: company.uuid,
      items: items.map(i => InvoiceQueryItemMapper.toDto(i)),
      pdfUrl: pdfUrl ?? undefined,
      isActive,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  },
};
