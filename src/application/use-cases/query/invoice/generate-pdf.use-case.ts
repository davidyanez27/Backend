import path from "path";

import { CustomError } from '../../../errors/customs.error';
import { PdfService } from '../../../../presentation/Services';
import { GeneralInvoicetemplate } from '../../../../presentation/helpers';
import { CompanyQueryRepository } from '../../../repositories/company-query.repository';
import { InvoiceQueryRepository } from '../../../repositories/invoice-query.repository';
import { CustomerQueryRepository } from '../../../repositories/customer-query.repository';
import { InvoicePdfData } from '../../../../domain/types/pdf.type';


interface GenerateInvoicePdfUseCase {
    execute(invoiceUuid: string, companyId: number, companyUuid: string, userId: number): Promise<PDFKit.PDFDocument>;
}

export class GenerateInvoicePdf implements GenerateInvoicePdfUseCase {
    constructor(
        private readonly companyQueryRepository: CompanyQueryRepository,
        private readonly invoiceQueryRepository: InvoiceQueryRepository,
        private readonly customerQueryRepository: CustomerQueryRepository,
        private readonly PdfService: PdfService,
        private readonly invoiceTemplate: GeneralInvoicetemplate
    ) { }

    async execute(invoiceUuid: string, companyId: number, companyUuid: string, userId: number): Promise<PDFKit.PDFDocument> {
        const invoice = await this.invoiceQueryRepository.findById(invoiceUuid, companyId);
        if (!invoice) throw CustomError.notFound("Invoice not found");

        const [customer, company] = await Promise.all([
            this.customerQueryRepository.findById(invoice.customer, companyId),
            this.companyQueryRepository.findById(companyUuid, userId),
        ]);

        if (!customer) throw CustomError.notFound("Customer not found");
        if (!company) throw CustomError.notFound("Company not found");

        const pdfData: InvoicePdfData = {
            client: {
                name: customer.name,
                identifier: `${customer.identifier.type}: ${customer.identifier.value}`,
                email: customer.email ?? "N/A",
                address: customer.billingAddress,
            },
            company,
            currency: invoice.currency,
            subtotal: invoice.subtotal,
            discount: invoice.discount,
            tax: invoice.tax,
            total: invoice.total,
            amountPaid: invoice.amountPaid ?? 0,
            paymentMethod: invoice.paymentMethod ?? "",
            products: invoice.items.map(item => ({
                productId: null,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineTotal: item.lineTotal,
            })),
            notes: invoice.notes,
            invoiceNumber: invoice.number,
            issueDate: new Date(invoice.issueDate),
            dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
            status: invoice.status,
        };

        const fontsDir = path.resolve(process.cwd(), "fonts");
        const template = this.invoiceTemplate.build(pdfData, {
            defaultTaxRate: 0,
            currencyPrefix: invoice.currency,
            fonts: {
                normal: path.join(fontsDir, "Roboto-Regular.ttf"),
                bold: path.join(fontsDir, "Roboto-Bold.ttf"),
                italics: path.join(fontsDir, "Roboto-Italic.ttf"),
                bolditalics: path.join(fontsDir, "Roboto-BoldItalic.ttf"),
            },
        });

        return this.PdfService.generate(template);
    }
}
