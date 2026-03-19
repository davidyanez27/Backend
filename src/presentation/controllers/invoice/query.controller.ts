
import { NextFunction, Request, Response } from "express";
import { FindInvoice, GenerateInvoicePdf, FindInvoices } from "../../../application/use-cases";
import { PaginationQuery } from "@inventory/shared-types";
import { PdfService } from '../../Services';
import { GeneralInvoicetemplate } from '../../helpers';
import { CompanyQueryRepository, CustomerQueryRepository, InvoiceQueryRepository } from '../../../application/repositories';
import { envs } from "../../../config";


export class InvoiceQueryController {

    constructor(
        private readonly companyQueryRepository: CompanyQueryRepository,
        private readonly invoiceQueryRepository: InvoiceQueryRepository,
        private readonly customerQueryRepository: CustomerQueryRepository,
        private readonly pdfService: PdfService,
        private readonly invoiceTemplate: GeneralInvoicetemplate,

    ) { }

    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const { page = 1, limit = 5 } = req.query;

        const options = PaginationQuery.safeParse({ page, limit });
        if (!options.success) return next(options.error);

        const { invoices } = await new FindInvoices(this.invoiceQueryRepository).execute(companyId, options.data);
        const { pagination, data } = invoices;
        const response = {
            data,
            next: pagination.hasNext ? `${envs.WEBSERVICE_URL}/invoice?page=${pagination.page + 1}&limit=${pagination.limit}` : null,
            previous: pagination.hasPrev ? `${envs.WEBSERVICE_URL}/invoice?page=${pagination.page - 1}&limit=${pagination.limit}` : null,
        };
        res.json(response);
    }

    public findById = async (req: Request, res: Response) => {
        const invoiceId  = req.params.id as string;
        if (!invoiceId) return res.status(400).json({ error: 'Missing Invoice UUID' });
        const companyId = (req as any).companyId as number;

        const invoice = await new FindInvoice(this.invoiceQueryRepository).execute(invoiceId, companyId);
        res.json(invoice);
    }

    public generatePdfInvoice = async (req: Request, res: Response, next: NextFunction) => {
        const invoiceId  = req.params.id as string;
        if (!invoiceId) return res.status(400).json({ error: 'Missing Invoice UUID' });

        const userId = (req as any).userId as number;
        const companyId = (req as any).companyId as number;
        const companyUuid = (req as any).companyUuid as string;

        const pdf = await new GenerateInvoicePdf(
            this.companyQueryRepository,
            this.invoiceQueryRepository,
            this.customerQueryRepository,
            this.pdfService,
            this.invoiceTemplate,
        ).execute(invoiceId, companyId, companyUuid, userId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="report.pdf"');

        pdf.on('error', (error) => next(error));
        pdf.pipe(res);
        pdf.end();
    };

}
