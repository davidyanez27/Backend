import { CustomerQueryRepository, CompanyQueryRepository } from '../../../repositories';
import { InvoicePdfGenerator, InvoicePdfData, PdfLineItem } from '../../../../domain/types';
import { CustomError } from '../../../errors';

interface PreviewInput {
  customerId: string;
  companyId: number;
  companyUuid: string;
  userId: number;
  products: PdfLineItem[];
  notes?: string;
  discount?: number;
  tax?: number;
}

export class PreviewInvoicePdf {
  constructor(
    private customerQueryRepo: CustomerQueryRepository,
    private companyQueryRepo: CompanyQueryRepository,
    private pdfGenerator: InvoicePdfGenerator,
  ) {}

  async execute(input: PreviewInput): Promise<PDFKit.PDFDocument> {
    const [customer, company] = await Promise.all([
      this.customerQueryRepo.findById(input.customerId, input.companyId),
      this.companyQueryRepo.findById(input.companyUuid, input.userId)
    ]);

    if (!customer) throw CustomError.notFound("Customer not found");
    if (!company) throw CustomError.notFound("Company not found");

    const subtotal = input.products.reduce((sum, p) => sum + p.lineTotal, 0);
    const tax = input.tax ?? 0;
    const discount = input.discount ?? 0;
    const total = subtotal + tax - discount;

    const pdfData: InvoicePdfData = {
      client: {
        name: customer.name,
        identifier: `${customer.identifier.type}: ${customer.identifier.value}`,
        email: customer.email ?? "",
        address: customer.billingAddress,
      },
      company,
      currency: company.currency,
      subtotal,
      discount,
      tax,
      total,
      amountPaid: 0,
      paymentMethod: "",
      products: input.products,
      notes: input.notes,
      invoiceNumber: "DRAFT",
      issueDate: new Date(),
      dueDate: null,
      status: "DRAFT",
    };

    return this.pdfGenerator.generate(pdfData);
  }
}
