import { CompanyId, InvoiceId } from "../value-objects";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type PaymentProps = {
  invoiceId: InvoiceId;
  companyId: CompanyId;
  amount: number;
  method: string;
  reference?: string | null;
  status: PaymentStatus;
  paidAt: Date;
  isActive: boolean;
}
