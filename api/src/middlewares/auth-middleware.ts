import type { NextFunction, Request, Response } from "express";
import type { AuthUser } from "@/shared/user-schema";
import { UnauthorizedError } from "@/shared/app-error";
import jwt from 'jsonwebtoken';
import { env } from "@/configs/env";
import { ParsedQs } from "qs";

export interface AuthRequest<P = {},ResBody= any, ReqBody = any, Query = ParsedQs > extends Request<P,ResBody, ReqBody, Query> {
	user?: AuthUser; 
}


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
	try{

	const accessToken = req.cookies.accessToken as string;
	if(!accessToken) {
		throw new UnauthorizedError('User not authenticated');
	}
	const decoded = jwt.verify(accessToken,env.ACCESS_SECRET) as AuthUser;
	req.user = decoded;
	next();

	}
	catch(err: unknown) {
		next(err);
	}

}
