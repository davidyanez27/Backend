import { Router } from "express";
import { AuthController, AuthQueryController } from "../../controllers";

import { EmailService, TokenService } from "../../Services";
import { envs } from "../../../config";
import { AuthQueryRepositoryImpl, AuthRepositoryImpl } from '../../../infrastructure/repositories';
import {  AuthQueryDatasourceImpl, AuthDatasourceImpl } from '../../../infrastructure/datasources';

export class AuthRoutes {
    public static get routes(): Router {
        const router = Router();

        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY
        )

        const tokenService = new TokenService();

        const authDatasource = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl(authDatasource);


        const authQueryDatasource = new AuthQueryDatasourceImpl();
        const authQueryRepository = new AuthQueryRepositoryImpl(authQueryDatasource)

        const commandController = new AuthController(authRepository, emailService, tokenService);
        const queryController = new AuthQueryController(authQueryRepository, tokenService);

        //Command routes
        router.post('/register', commandController.registerUser);
        router.get('/validate-email/:token', commandController.validateUser);

        //Query routes
        router.post('/login', queryController.loginUser);
        router.post('/logout', queryController.logout);
        router.get('/refresh-token', queryController.validateToken);


        return router;
    }
}
