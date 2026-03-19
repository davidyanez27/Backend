import { NextFunction, Request, Response } from "express";
import { Jwt, CookieConfig } from "../../config";
import { AuthClaims } from "@inventory/shared-types";
import { AuthQueryRepository } from '../../application/repositories';

export class AuthMiddleware {

    constructor(
        private readonly authQueryRepository: AuthQueryRepository,
    ) {}

    public ValidateJWT = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies[CookieConfig.TOKEN_COOKIE_NAME];
        if (!token) return res.status(401).json({ error: 'Missing authentication token' });

        try {
            const payload = await Jwt.validateToken<AuthClaims>(token);
            if (!payload) return res.status(401).json({ error: "Invalid Token" });
            if (!payload.sub) return res.status(401).json({ error: "Invalid Token, sub is missing in the token" });
            if (!payload.org) return res.status(401).json({ error: "Invalid Token, org is missing in the token" });

            const identity = await this.authQueryRepository.resolveIdentity(payload.sub, payload.org);
            if (!identity) return res.status(403).json({ error: "User does not belong to this company" });

            (req as any).userId = identity.userId;
            (req as any).userUuid = identity.userUuid;
            (req as any).fullName = identity.fullName;
            (req as any).appRole = identity.appRole;
            (req as any).companyId = identity.companyId;
            (req as any).companyUuid = identity.companyUuid;
            (req as any).companyName = identity.companyName;
            (req as any).companyRole = identity.companyRole;

            return next();
        } catch (error) {
            console.log(error);
            return res.status(500).json("Internal Server Error");
        }
    }
}
