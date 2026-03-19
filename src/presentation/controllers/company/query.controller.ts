
import { NextFunction, Request, Response } from "express";
import { FindCompany, FindCompanies } from "../../../application/use-cases";
import { PaginationQuery } from "@inventory/shared-types";
import { CompanyQueryRepository } from '../../../application/repositories';
import { envs } from "../../../config";


export class CompanyQueryController {

    constructor(
        private readonly companyQueryRepository: CompanyQueryRepository,
    ) { }


    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).userId as number;
        const { page = 1, limit = 5 } = req.query;

        const options = PaginationQuery.safeParse({ page, limit });
        if (!options.success) return next(options.error);

        const { companies } = await new FindCompanies(this.companyQueryRepository).execute(userId, options.data);
        const { pagination, data } = companies;
        const response = {
            data,
            next: pagination.hasNext ? `${envs.WEBSERVICE_URL}/company?page=${pagination.page + 1}&limit=${pagination.limit}` : null,
            previous: pagination.hasPrev ? `${envs.WEBSERVICE_URL}/company?page=${pagination.page - 1}&limit=${pagination.limit}` : null,
        };
        res.json(response);
    }

    public findById = async (req: Request, res: Response) => {
        const companyId  = req.params.id as string;
        if (!companyId) return res.status(400).json({ error: 'Missing Company UUID' });
        const userId = (req as any).userId as number;

        const company = await new FindCompany(this.companyQueryRepository).execute(companyId, userId);
        res.json(company);
    }


}
