import { Router } from "express";
import { CustomerController, CustomerQueryController } from "../../controllers";
import { AuthMiddleware, CheckRolesMiddleware  } from '../../middlewares';
import { CustomerDatasourceImpl, CustomerQueryDatasourceImpl } from '../../../infrastructure/datasources';
import { CustomerQueryRepositoryImpl, CustomerRepositoryImpl } from '../../../infrastructure/repositories';

export class CustomerRoutes {
    public static get routes():Router{
        const router = Router();

        const customerDatasource = new CustomerDatasourceImpl();
        const customerQueryDatasource = new CustomerQueryDatasourceImpl();

        const customerRepository = new CustomerRepositoryImpl(customerDatasource)
        const customerQueryRepository = new CustomerQueryRepositoryImpl(customerQueryDatasource)

        const commandController = new CustomerController(customerRepository);
        const queryController = new CustomerQueryController(customerQueryRepository);

        const requireWriteAccess = CheckRolesMiddleware.CheckCompanyRole("OWNER", "ADMIN");

        router.post('/create',       requireWriteAccess, commandController.createCustomer);
        router.put ('/update/:id',   requireWriteAccess, commandController.updateCustomer);
        router.delete('/delete/:id', requireWriteAccess, commandController.deleteCustomer);

        router.get ('/findAll',      queryController.findAll);
        router.get ('/find/:id',     queryController.findById);


        return router;
    }
}