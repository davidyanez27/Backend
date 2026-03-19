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

        router.use('/api/auth',  AuthRoutes.routes)

        router.use('/api',  authMiddleware.ValidateJWT)
        router.use('/api/products', ProductsRoutes.routes)
        router.use('/api/companies', CompanyRoutes.routes)
        router.use('/api/customers', CustomerRoutes.routes)
        router.use('/api/invoices', InvoiceRoutes.routes)
        router.use('/api/users', UsersRoutes.routes)



        // router.use('/api/reports',  ReportsRoutes.routes)



        return router;
    }
}