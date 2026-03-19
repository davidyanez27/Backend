import { CompanyId, CustomerId, ProductId, UserId } from "../value-objects";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELED";

export type InvoicePaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "OTHER";

export interface InvoiceItemSnapshot {
  id?: string;
  productId?: ProductId | null;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discount?: number;
}

export interface InvoiceProps {
  // Invoice identification
  number: string;
  status: InvoiceStatus;
  currency: string;

  // Dates
  issueDate: Date;
  dueDate: Date | null;

  // Monetary values (auto-calculated by entity)
  subtotal: number;
  tax: number;
  discount: number;
  total: number;

  // Customer reference
  customerId: CustomerId;

  // Customer snapshot (denormalized for PDF generation)
  customerName?: string;
  customerAddress?: string;
  customerIdentifier?: string;
  customerEmail?: string | null;

  // Company ownership
  companyId: CompanyId;

  // Line items
  items: InvoiceItemSnapshot[];

  // Payment tracking
  paymentMethod?: InvoicePaymentMethod;
  amountPaid?: number;
  paymentDate?: Date | null;
  paymentNotes?: string | null;

  // Optional
  notes?: string | null;
  pdfUrl?: string | null;

  // Metadata
  createdById?: UserId | null;
  updatedById?: UserId | null;
  createdAt?: Date;
  updatedAt?: Date;
}
