import { Company } from "@inventory/shared-types";
import { InvoiceStatus } from "./invoice.type";

export type PdfLineItem = {
  productId?: number | null;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discount?: number;
};

export type InvoicePdfData = {
  client: {
    name: string;
    identifier: string;
    email: string;
    address: string;
  };
  company: Company;
  currency: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  paymentMethod: string;
  products: PdfLineItem[];
  notes?: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate?: Date | null;
  status: InvoiceStatus;
};

export interface InvoicePdfGenerator {
  generate(data: InvoicePdfData): Promise<PDFKit.PDFDocument>;
}

export type InvoicePdfOptions = {
  defaultTaxRate?: 0 | 0.15 | 0.18; 
  currencyPrefix?: string;          
  fonts?: {
    normal: string;
    bold: string;
    italics?: string;
    bolditalics?: string;
  };
};