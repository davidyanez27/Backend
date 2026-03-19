import { NextFunction, Request, Response } from "express";
import { SendValidationEmail, RegisterUserUseCase, ValidateEmail } from "../../../application/use-cases/domain";
import { EmailService, TokenService } from "../../Services";
import { envs, CookieConfig } from "../../../config";
import { AuthRepository } from '../../../domain/repositories';
import { DefaultRegisterSchema } from '@inventory/shared-types';
import { DtoUserMapper } from '../../mappers/user.mapper';
import { DtoCompanyMapper } from '../../mappers/company.mapper';

export class AuthController {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly emailService: EmailService,
        private readonly tokenService: TokenService,
    ) { }

    public registerUser = async (req: Request, res: Response, next: NextFunction) => {
        const payload = DefaultRegisterSchema.safeParse(req.body)
        if (!payload.success) return next(payload.error);

        const user = DtoUserMapper.FromRegisterDto(payload.data);
        const company = DtoCompanyMapper.FromRegisterDto(payload.data);

        const result = await new RegisterUserUseCase(this.authRepository).execute(user, company);

        const token = await this.tokenService.CreateToken({
            sub: user.id.value,
            rid: result.user.appRole,
            org: company.id.value,
        });

        res.cookie(CookieConfig.TOKEN_COOKIE_NAME, token, CookieConfig.getTokenCookieOptions());

        res.json({
            user: result.user,
            company: result.company,
            message: "Registration successful",
        });

        void new SendValidationEmail(this.emailService, envs.WEBSERVICE_URL).execute(result.user.email, user.id.value, company.id.value)
    }

    public validateUser = async (req: Request, res: Response) => {
        const token = req.params.token as string;
        const message = await new ValidateEmail(this.authRepository).execute(token)
        res.json(message)
    }

}
