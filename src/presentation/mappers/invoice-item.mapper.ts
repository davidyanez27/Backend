import { InvoiceItem } from "@inventory/shared-types";
import { InvoiceItemSnapshot } from '../../domain/types';
import { ProductId } from '../../domain/value-objects';

export const DtoInvoiceItemMapper = {
  FromDto(dto: InvoiceItem, resolvedProductId: number | null): InvoiceItemSnapshot {
    const { description, quantity, unitPrice, lineTotal } = dto;
    return {
      productId: resolvedProductId ? new ProductId(resolvedProductId) : null,
      description,
      quantity,
      unitPrice,
      lineTotal,
    };
  },

  ToDto(snapshot: InvoiceItemSnapshot) {
    const { productId, description, quantity, unitPrice, lineTotal } = snapshot;
    return {
      productId: productId?.getValue() ?? null,
      description,
      quantity,
      unitPrice,
      lineTotal,
    };
  }
};
