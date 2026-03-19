
import { NextFunction, Request, Response } from "express";
import { CreateCompany, UpdateCompany } from "../../../application/use-cases";
import { CompanyRepository } from '../../../domain/repositories';
import { DtoCompanyMapper } from '../../mappers';
import { CreateCompanySchema, UpdateCompanySchema } from "@inventory/shared-types";

export class CompanyController {

    constructor(
        private readonly companyRepository: CompanyRepository,
    ) { }


    public createCompany = async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).userId as number;

        const payload = CreateCompanySchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);

        const companyEntity = DtoCompanyMapper.FromDto(payload.data);
        const company = await new CreateCompany(this.companyRepository).execute(companyEntity!, userId);
        res.status(201).json(company);
    }

    public updateCompany = async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).userId as number;
        const companyId = (req as any).companyId as number;
        const targetCompanyId  = req.params.id as string;
        if (!targetCompanyId) return res.status(400).json({ error: 'Missing Company UUID' });

        const payload = UpdateCompanySchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);

        const company = await new UpdateCompany(this.companyRepository).execute(targetCompanyId, companyId, userId, payload.data);
        res.json(company);
    }


}
