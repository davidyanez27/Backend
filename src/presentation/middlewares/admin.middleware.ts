import { NextFunction, Request, Response } from "express";

/**
 * Middleware to protect admin-only routes.
 * Requires the user to have AppRole.ADMIN to access.
 * Must be used AFTER AuthMiddleware.ValidateJWT
 */
export const requireAppAdmin = (req: Request, res: Response, next: NextFunction) => {
    const appRole = (req as any).appRole as string | undefined;

    if (!appRole) {
        return res.status(401).json({ error: "Authentication required" });
    }

    if (appRole !== "ADMIN") {
        return res.status(403).json({ error: "Admin access required" });
    }

    return next();
};
