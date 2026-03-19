import { Router } from "express";
import { CompanyController, CompanyQueryController } from "../../controllers";
import { AuthMiddleware, CheckRolesMiddleware  } from '../../middlewares';
import { CompanyDatasourceImpl, CompanyQueryDatasourceImpl } from '../../../infrastructure/datasources';
import { CompanyQueryRepositoryImpl, CompanyRepositoryImpl } from '../../../infrastructure/repositories';

export class CompanyRoutes {
    public static get routes():Router{
        const router = Router();

        const companyDatasource = new CompanyDatasourceImpl();
        const companyQueryDatasource = new CompanyQueryDatasourceImpl();

        const companyRepository = new CompanyRepositoryImpl(companyDatasource)
        const companyQueryRepository = new CompanyQueryRepositoryImpl(companyQueryDatasource)

        const commandController = new CompanyController(companyRepository);
        const queryController = new CompanyQueryController(companyQueryRepository);

        const requireOwner = CheckRolesMiddleware.CheckCompanyRole("OWNER");

        router.post('/create',       commandController.createCompany);
        router.put ('/update/:id',   requireOwner, commandController.updateCompany);

        router.get ('/findAll',      queryController.findAll);
        router.get ('/find/:id',     queryController.findById);



        return router;
    }
}