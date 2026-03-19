import { NextFunction, Request, Response } from "express";
import { CreateProduct, DeleteProduct, UpdateProduct } from "../../../application/use-cases";
import { ProductsRepository } from '../../../domain/repositories';
import { CreateProductSchema, UpdateProductSchema } from "@inventory/shared-types";


export class ProductsController {

    constructor(
        private readonly productsRepository: ProductsRepository,
    ) { }


    public createProduct = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const userId = (req as any).userId as number;
        const fullName = (req as any).fullName as string;

        const payload = CreateProductSchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);

        const product = await new CreateProduct(this.productsRepository).execute({
            ...payload.data,
            companyId,
            userId,
            fullName,
        });

        res.status(201).json(product);
    }

    public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const userId = (req as any).userId as number;
        const fullName = (req as any).fullName as string;

        const payload = UpdateProductSchema.safeParse(req.body);
        if (!payload.success) return next(payload.error);

        const product = await new UpdateProduct(this.productsRepository).execute({
            ...payload.data,
            companyId,
            userId,
            fullName,
        });
        res.json(product);
    }

    public deleteProduct = async (req: Request, res: Response) => {
        const productId  = req.params.id as string;
        if (!productId) return res.status(400).json({ error: 'Missing Invoice UUID' });
        const companyId = (req as any).companyId as number;

        await new DeleteProduct(this.productsRepository).execute(productId, companyId);

        res.json('Invoice deleted successfully');
    }

}
