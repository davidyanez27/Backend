import { InvoiceEntity } from '../../domain/entities';
import { CreateInvoiceDto } from "@inventory/shared-types";
import { CompanyId, CustomerId } from '../../domain/value-objects';
import { InvoiceItemSnapshot } from '../../domain/types';

export const DtoInvoiceMapper = {
  FromDto(dto: CreateInvoiceDto, companyId: number, customerId: number, resolvedItems: InvoiceItemSnapshot[]): InvoiceEntity {
    const { number, status, currency, issueDate, dueDate, tax, discount, notes } = dto;
    return InvoiceEntity.createNew({
      number: number ?? 'PENDING',
      status,
      currency,
      issueDate: new Date(issueDate),
      dueDate: dueDate ? new Date(dueDate) : null,
      tax,
      discount,
      notes,
      customerId: new CustomerId(customerId),
      companyId: new CompanyId(companyId),
      items: resolvedItems,
    });
  },
};
