import { Router } from "express";
import { UserController, UserQueryController } from "../../controllers";
import { AuthMiddleware, CheckRolesMiddleware  } from '../../middlewares';
import { UserDatasourceImpl, UserQueryDatasourceImpl } from '../../../infrastructure/datasources';
import { UserRepositoryImpl, UserQueryRepositoryImpl  } from '../../../infrastructure/repositories';

export class UsersRoutes {
    public static get routes():Router{
        const router = Router();

        const userDatasource = new UserDatasourceImpl();
        const userQueryDatasource = new UserQueryDatasourceImpl();

        const userRepository = new UserRepositoryImpl(userDatasource)
        const userQueryRepository = new UserQueryRepositoryImpl(userQueryDatasource)

        const commandController = new UserController(userRepository);
        const queryController = new UserQueryController(userQueryRepository);

        const requireWriteAccess = CheckRolesMiddleware.CheckCompanyRole("OWNER", "ADMIN");

        router.post('/create',       requireWriteAccess, commandController.createUser);
        router.get ('/findAll',      queryController.findAll);
        router.get ('/find/:id',     queryController.findById);
        router.put ('/update/:id',   requireWriteAccess, commandController.updateUser);
        router.delete('/delete/:id', requireWriteAccess, commandController.deleteUser);


        return router;
    }
}