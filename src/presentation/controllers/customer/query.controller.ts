
import { NextFunction, Request, Response } from "express";
import { FindCustomer, FindCustomers } from "../../../application/use-cases";
import { PaginationQuery } from "@inventory/shared-types";
import { CustomerQueryRepository } from '../../../application/repositories';
import { envs } from "../../../config";

export class CustomerQueryController {

    constructor(
        private readonly customerQueryRepository: CustomerQueryRepository,
    ) { }

    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const { page = 1, limit = 5 } = req.query;

        const options = PaginationQuery.safeParse({ page, limit });
        if (!options.success) return next(options.error);

        const { customers } = await new FindCustomers(this.customerQueryRepository).execute(companyId, options.data);
        const { pagination, data } = customers;
        const response = {
            data,
            next: pagination.hasNext ? `${envs.WEBSERVICE_URL}/customer?page=${pagination.page + 1}&limit=${pagination.limit}` : null,
            previous: pagination.hasPrev ? `${envs.WEBSERVICE_URL}/customer?page=${pagination.page - 1}&limit=${pagination.limit}` : null,
        };
        res.json(response);
    }

    public findById = async (req: Request, res: Response) => {
        const customerId  = req.params.id as string;
        if (!customerId) return res.status(400).json({ error: 'Missing Customer UUID' });
        const companyId = (req as any).companyId as number;

        const customer = await new FindCustomer(this.customerQueryRepository).execute(customerId, companyId);
        res.json(customer);
    }

}
