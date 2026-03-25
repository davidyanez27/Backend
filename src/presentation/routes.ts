import { Router } from "express";
import { AuthRoutes, CompanyRoutes, CustomerRoutes, ProductsRoutes, InvoiceRoutes, UsersRoutes } from "./routes/index";
import { AuthMiddleware } from "./middlewares";
import { AuthQueryDatasourceImpl } from "../infrastructure/datasources";
import { AuthQueryRepositoryImpl } from "../infrastructure/repositories";

export class AppRoutes {
    public static get routes():Router{
        const router = Router();

        const authQueryDatasource = new AuthQueryDatasourceImpl();
        const authQueryRepository = new AuthQueryRepositoryImpl(authQueryDatasource);
        const authMiddleware = new AuthMiddleware(authQueryRepository);

        // Public routes — NO middleware
        router.use('/api/auth', AuthRoutes.routes);

        // Protected routes — WITH middleware
        router.use('/api/products', authMiddleware.ValidateJWT, ProductsRoutes.routes);
        router.use('/api/companies', authMiddleware.ValidateJWT, CompanyRoutes.routes);
        router.use('/api/customers', authMiddleware.ValidateJWT, CustomerRoutes.routes);
        router.use('/api/invoices', authMiddleware.ValidateJWT, InvoiceRoutes.routes);
        router.use('/api/users', authMiddleware.ValidateJWT, UsersRoutes.routes);



        return router;
    }
}