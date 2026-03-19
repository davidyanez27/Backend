import { Router } from "express";
import { ProductsController, ProductsQueryController } from "../../controllers";
import { AuthMiddleware, CheckRolesMiddleware  } from '../../middlewares';
import { ProductDatasourceImpl, ProductQueryDatasourceImpl } from '../../../infrastructure/datasources';
import { ProductRepositoryImpl, ProductQueryRepositoryImpl  } from '../../../infrastructure/repositories';

export class ProductsRoutes {
    public static get routes():Router{
        const router = Router();

        const productDatasource = new ProductDatasourceImpl();
        const productQueryDatasource = new ProductQueryDatasourceImpl();

        const productRepository = new ProductRepositoryImpl(productDatasource)
        const productQueryRepository = new ProductQueryRepositoryImpl(productQueryDatasource)

        const commandController = new ProductsController(productRepository);
        const queryController = new ProductsQueryController(productQueryRepository);

        const requireWriteAccess = CheckRolesMiddleware.CheckCompanyRole("OWNER", "ADMIN");

        router.post('/create',       requireWriteAccess, commandController.createProduct);
        router.get ('/findAll',      queryController.findAll);
        router.get ('/find/:id',     queryController.findById);
        router.put ('/update/:id',   requireWriteAccess, commandController.updateProduct);
        router.delete('/delete/:id', requireWriteAccess, commandController.deleteProduct);


        return router;
    }
}