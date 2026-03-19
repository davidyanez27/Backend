import { NextFunction, Request, Response } from "express";
import { LoginUser, RenewToken } from "../../../application/use-cases/domain";
import { CustomError } from "../../../application/errors/customs.error";
import { TokenService } from "../../Services";
import { CookieConfig, Jwt } from "../../../config";
import { LoginSchema } from '@inventory/shared-types';
import { AuthClaims } from "@inventory/shared-types";
import { AuthQueryRepository } from '../../../application';


export class AuthQueryController {

    constructor(
        private readonly AuthQueryRepository: AuthQueryRepository,
        private readonly tokenService: TokenService,
    ) { }

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        const payload = LoginSchema.safeParse(req.body)
        if (!payload.success) return next(payload.error);
        const { email, password } = payload.data

        const {user, company} = await new LoginUser(this.AuthQueryRepository).execute(email, password);
        const token = await this.tokenService.CreateToken({ sub: user.uuid, rid: user.appRole, org: company.id });

        res.cookie(CookieConfig.TOKEN_COOKIE_NAME, token, CookieConfig.getTokenCookieOptions());

        res.json({
            user,
            company
        });
    }

    public logout = (req: Request, res: Response) => {
        res.clearCookie(CookieConfig.TOKEN_COOKIE_NAME, CookieConfig.getClearCookieOptions());
        res.json({ message: "Logged out successfully" });
    }

    public validateToken = async (req: Request, res: Response) => {
        const token = req.cookies[CookieConfig.TOKEN_COOKIE_NAME];
        if (!token) {
            res.clearCookie(CookieConfig.TOKEN_COOKIE_NAME, CookieConfig.getTokenCookieOptions());
            throw CustomError.badRequest('No authentication token provided');
        }

        const decode = await Jwt.validateToken<AuthClaims>(token);
        if (!decode || typeof decode !== 'object' || !('sub' in decode)) {
            res.clearCookie(CookieConfig.TOKEN_COOKIE_NAME, CookieConfig.getTokenCookieOptions());
            throw CustomError.internalServer('Invalid token');
        }
        
        if (decode.org == null) throw CustomError.badRequest('No organization attached to token');

        const identity = await this.AuthQueryRepository.resolveIdentity(decode.sub, decode.org);
        if (!identity) throw CustomError.badRequest('User does not belong to this company');

        const {user, company} = await new RenewToken(this.AuthQueryRepository).execute(identity.userId, identity.companyId)
        const newToken = await this.tokenService.CreateToken({ sub: user.uuid, rid: user.appRole, org: identity.companyUuid });

        res.cookie(CookieConfig.TOKEN_COOKIE_NAME, newToken, CookieConfig.getTokenCookieOptions());
        res.json({ user, company });
    }
}
