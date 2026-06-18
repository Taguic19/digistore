import { ForbiddenError, UnauthorizedError } from "@/shared/app-error";
import { type AuthRequest } from "./auth-middleware";
import type { NextFunction, Response } from "express";


export const authorize = (...roles: string[]) => {

	return (req: AuthRequest, res: Response, next: NextFunction) => {
		if(!req.user) {
			throw new UnauthorizedError('User Unathenticated');
		}
		if(!roles.includes(req.user.role)) {
			throw new ForbiddenError('Route is Forbidden');
		}
		next();
	}
}


