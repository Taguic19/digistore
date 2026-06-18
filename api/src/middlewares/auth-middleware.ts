import type { NextFunction, Request, Response } from "express";
import type { AuthUser } from "@/shared/user-schema";
import { UnauthorizedError } from "@/shared/app-error";
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
	user?: AuthUser; 
}


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
	const authHeader = req.headers['authorization'];
	if(!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new UnauthorizedError('Missing or invalid authorization header');
	}
	const token = authHeader.split(' ')[1].trim();

	if(!token) {
		throw new UnauthorizedError('Invalid Authorization Header'); 
	}
	try{

	const decoded = jwt.verify(token,process.env.ACCESS_SECRET!) as AuthRequest['user'];
	req.user = decoded;
	next();	
	}
	catch(err: unknown) {
		res.status(401).json({ message: 'Invalid or expired token' });
	}

}
