import { InvoiceEntity } from '../../../domain/entities';
import { InvoiceItemSnapshot } from '../../../domain/types/invoice.type';
import { InvoiceCommandItemMapper } from '../invoice-item/invoice-item.mapper';
import { Invoice, Prisma } from "@prisma/client";


export const withRelations = Prisma.validator<Prisma.InvoiceDefaultArgs>()({
  include: {
    customer: {
      select: {
        name: true,
        billingAddress: true,
        type: true,
        identifier: true,
        email: true,
      }
    },
    items: true,
  },
});
export type InvoiceWithRelations = Prisma.InvoiceGetPayload<typeof withRelations>;

export const InvoiceCommandMapper = {

  fromPrisma(row: InvoiceWithRelations): InvoiceEntity {
    const { uuid, number, status, currency, issueDate, dueDate, subtotal, tax, discount, total, notes, companyId, customerId, items, pdfUrl, paymentMethod, amountPaid, paymentDate, paymentNotes, createdById, updatedById, customer } = row;

    const mappedItems: InvoiceItemSnapshot[] = items.map(i => InvoiceCommandItemMapper.fromPrisma(i));

    return InvoiceEntity.fromSnapshot({
      id: uuid,
      number,
      status,
      currency,
      issueDate,
      dueDate,
      subtotal: subtotal?.toNumber() ?? 0,
      tax: tax?.toNumber() ?? 0,
      discount: discount?.toNumber() ?? 0,
      total: total?.toNumber() ?? 0,
      paymentMethod,
      amountPaid: amountPaid?.toNumber() ?? 0,
      paymentDate,
      paymentNotes,
      notes,
      customerId,
      customerName: customer.name,
      customerAddress: customer.billingAddress,
      customerEmail: customer.email,
      customerIdentifier: `${customer.type}: ${customer.identifier}`,
      companyId,
      items: mappedItems,
      pdfUrl,
      createdById: createdById ?? null,
      updatedById: updatedById ?? null,
    });
  },

  toPrismaCreate(invoiceEntity: InvoiceEntity, companyId: number, customerId: number, createdById?: number | null): Prisma.InvoiceUncheckedCreateInput {
    const invoice = invoiceEntity.snapshot;
    const { id, number, status, currency, issueDate, dueDate, subtotal, tax, discount, total, paymentMethod, amountPaid, paymentDate, paymentNotes, notes, items, pdfUrl } = invoice;

    return {
      uuid: id,
      number,
      status,
      currency,
      issueDate,
      dueDate,
      subtotal: new Prisma.Decimal(subtotal),
      tax: new Prisma.Decimal(tax),
      discount: new Prisma.Decimal(discount),
      total: new Prisma.Decimal(total),
      paymentMethod: paymentMethod as Prisma.InvoiceUncheckedCreateInput['paymentMethod'],
      amountPaid: new Prisma.Decimal(amountPaid),
      paymentDate: paymentDate ?? null,
      paymentNotes: paymentNotes ?? null,
      notes: notes ?? null,
      customerId,
      companyId,
      createdById,
      items: {
        create: items.map(i => InvoiceCommandItemMapper.toPrismaNestedCreate(i)),
      },
      pdfUrl: pdfUrl ?? null,
    };
  },

  toPrismaUpdate(invoiceEntity: InvoiceEntity): Prisma.InvoiceUncheckedUpdateInput {
    const invoice = invoiceEntity.snapshot;
    const { number, status, currency, issueDate, dueDate, subtotal, tax, discount, total, paymentMethod, amountPaid, paymentDate, paymentNotes, notes, pdfUrl } = invoice;

    return {
      number,
      status,
      currency,
      issueDate,
      dueDate,
      subtotal: new Prisma.Decimal(subtotal),
      tax: new Prisma.Decimal(tax),
      discount: new Prisma.Decimal(discount),
      total: new Prisma.Decimal(total),
      paymentMethod: paymentMethod as Prisma.InvoiceUncheckedUpdateInput['paymentMethod'],
      amountPaid: new Prisma.Decimal(amountPaid),
      paymentDate: paymentDate ?? null,
      paymentNotes: paymentNotes ?? null,
      notes: notes ?? null,
      pdfUrl: pdfUrl ?? null,
    };
  },
};
