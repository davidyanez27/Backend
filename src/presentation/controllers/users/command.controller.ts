import { NextFunction, Request, Response } from "express";
import { CreateUser, UpdateUser } from "../../../application/use-cases";
import { UserRepository } from '../../../domain/repositories';
import { CreateUserSchema, UpdateUserSchema } from '@inventory/shared-types';

export class UserController {

    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const companyUuid = (req as any).companyUuid as string;

        const payload = CreateUserSchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);

        const user = await new CreateUser(this.userRepository).execute(payload.data, companyUuid);
        res.status(201).json(user);
    }

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const userUuid  = req.params.id as string;
        if (!userUuid) return res.status(400).json({ error: 'Missing User UUID' });

        const payload = UpdateUserSchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);

        await new UpdateUser(this.userRepository).execute(userUuid, companyId, payload.data.fullName);
        res.json({ message: 'User updated successfully' });
    }

    public deleteUser = async (req: Request, res: Response) => {
        const companyId = (req as any).companyId as number;
        const userUuid  = req.params.id as string;
        if (!userUuid) return res.status(400).json({ error: 'Missing User UUID' });

        await this.userRepository.delete(userUuid, companyId);
        res.json({ message: 'User deleted successfully' });
    }

}
