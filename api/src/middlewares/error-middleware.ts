import type { Request, Response, NextFunction } from "express";
import { makeError } from "@/shared/app-error";
import { NotFoundError } from "@/shared/app-error";


export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	next(new NotFoundError(`${req.originalUrl} was not found`));
}


export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
	const {error, statusCode} = makeError(err);
	res.status(statusCode).json(error);

}