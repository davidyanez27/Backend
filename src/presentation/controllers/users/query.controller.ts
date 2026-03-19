import { NextFunction, Request, Response } from "express";
import { PaginationQuery } from '@inventory/shared-types';
import { FindUser, FindUsers, UserQueryRepository } from '../../../application';
import { envs } from "../../../config";

export class UserQueryController {

    constructor(
        private readonly userQueryRepository: UserQueryRepository,
    ) { }

    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const { page = 1, limit = 5 } = req.query;

        const options = PaginationQuery.safeParse({ page, limit });
        if (!options.success) return next(options.error);

        const { users } = await new FindUsers(this.userQueryRepository).execute(companyId, options.data);
        const { pagination, data } = users;
        const response = {
            data,
            next: pagination.hasNext ? `${envs.WEBSERVICE_URL}/users?page=${pagination.page + 1}&limit=${pagination.limit}` : null,
            previous: pagination.hasPrev ? `${envs.WEBSERVICE_URL}/users?page=${pagination.page - 1}&limit=${pagination.limit}` : null,
        };
        res.json(response);
    }

    public findById = async (req: Request, res: Response) => {
        const userUuid  = req.params.id as string;
        if (!userUuid) return res.status(400).json({ error: 'Missing User UUID' });
        const companyId = (req as any).companyId as number;

        const user = await new FindUser(this.userQueryRepository).execute(userUuid, companyId);
        res.json(user);
    }
}
