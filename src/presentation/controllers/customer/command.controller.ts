
import { NextFunction, Request, Response } from "express";
import { CreateCustomer, UpdateCustomer, DeleteCustomer } from "../../../application/use-cases";
import { CustomerRepository } from '../../../domain/repositories';
import { DtoCustomerMapper } from '../../mappers';
import { CreateCustomerSchema, UpdateCustomerSchema } from "@inventory/shared-types";


export class CustomerController {

    constructor(
        private readonly customerRepository: CustomerRepository,
    ) { }


    public createCustomer = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;

        const payload = CreateCustomerSchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);
        const customerEntity = DtoCustomerMapper.FromDto(payload.data, companyId);
        await new CreateCustomer(this.customerRepository).execute(customerEntity!);

        res.status(201).json({ message: 'Customer created successfully' });
    }

    public updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const customerId  = req.params.id as string;
        if (!customerId) return res.status(400).json({ error: 'Missing Customer UUID' });

        const payload = UpdateCustomerSchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);

        const { name, billingAddress, shippingAddress, email, phone, notes } = payload.data!;
        const customer = await new UpdateCustomer(this.customerRepository).execute(customerId, companyId, name, billingAddress, shippingAddress, email, phone, notes);
        res.json(customer);
    }

    public deleteCustomer = async (req: Request, res: Response) => {
        const companyId = (req as any).companyId as number;
        const customerId  = req.params.id as string;
        if (!customerId) return res.status(400).json({ error: 'Missing Customer UUID' });

        await new DeleteCustomer(this.customerRepository).execute(customerId, companyId);
        res.json({ message: 'Customer deleted successfully' });
    }

}
