
import { NextFunction, Request, Response } from "express";
import { FindProducts, FindProduct } from "../../../application/use-cases";
import { PaginationQuery } from "@inventory/shared-types";
import { ProductQueryRepository } from '../../../application/repositories';
import { envs } from "../../../config";


export class ProductsQueryController {

    constructor(
        private readonly productsQueryRepository: ProductQueryRepository,
    ) { }

    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        const companyId = (req as any).companyId as number;
        const { page = 1, limit = 5 } = req.query;

        const options = PaginationQuery.safeParse({ page, limit });
        if (!options.success) return next(options.error);

        const { products } = await new FindProducts(this.productsQueryRepository).execute(companyId, options.data);
        const { pagination, data } = products;
        const response = {
            data,
            next: pagination.hasNext ? `${envs.WEBSERVICE_URL}/products?page=${pagination.page + 1}&limit=${pagination.limit}` : null,
            previous: pagination.hasPrev ? `${envs.WEBSERVICE_URL}/products?page=${pagination.page - 1}&limit=${pagination.limit}` : null,
        };
        res.json(response);
    }

    public findById = async (req: Request, res: Response) => {
        const productId  = req.params.id as string;
        if (!productId) return res.status(400).json({ error: 'Missing Product UUID' });
        const companyId = (req as any).companyId as number;

        const product = await new FindProduct(this.productsQueryRepository).execute(productId, companyId);
        res.json(product);
    }

}
