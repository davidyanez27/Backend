import { NextFunction, Request, Response } from "express";

type CompanyRole = "OWNER" | "ADMIN" | "MEMBER";

export class CheckRolesMiddleware {
    static CheckCompanyRole(...allowedRoles: CompanyRole[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const companyRole = (req as any).companyRole as CompanyRole | undefined;

            if (!companyRole) {
                return res.status(401).json({ error: "Missing company role information" });
            }

            if (!allowedRoles.includes(companyRole)) {
                return res.status(403).json({ error: "Insufficient permissions for this action" });
            }

            return next();
        };
    }
}