
import { NextFunction, Request, Response } from "express";
import { CreateInvoice, DeleteInvoice, UpdateInvoice } from "../../../application/use-cases";
import { InvoiceRepository } from '../../../domain/repositories';
import { CreateInvoiceSchema, UpdateInvoiceSchema } from "@inventory/shared-types";
import { CustomerQueryRepository, ProductQueryRepository } from '../../../application/repositories';


export class InvoiceController {

    constructor(
        private readonly invoiceRepository: InvoiceRepository,
        private readonly customerQueryRepository: CustomerQueryRepository,
        private readonly productQueryRepository: ProductQueryRepository,
    ) { }


    public createInvoice = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const userId = (req as any).userId as number;

        const payload = CreateInvoiceSchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);

        await new CreateInvoice(this.invoiceRepository, this.customerQueryRepository, this.productQueryRepository)
            .execute(payload.data, companyId, userId);

        res.status(201).json("Invoice created successfully");
    }

    public updateInvoice = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const invoiceId  = req.params.id as string;
        if (!invoiceId) return res.status(400).json({ error: 'Missing Invoice UUID' });

        const payload = UpdateInvoiceSchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);

        await new UpdateInvoice(this.invoiceRepository).execute(invoiceId, companyId, payload.data);
        res.json({ message: 'Invoice updated successfully' });
    }

    public deleteInvoice = async (req: Request, res: Response) => {
        const invoiceId  = req.params.id as string;
        if (!invoiceId) return res.status(400).json({ error: 'Missing Invoice UUID' });
        const companyId = (req as any).companyId as number;

        await new DeleteInvoice(this.invoiceRepository).execute(invoiceId, companyId);

        res.json('Invoice deleted successfully');
    }

}
