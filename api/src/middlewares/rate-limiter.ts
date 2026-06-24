import { NextFunction, Request, Response } from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { authLimiter } from '@/configs/rate-limiter'

export const createRateLimitMiddleware = (limiter: RateLimiterMemory) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try{
		await limiter.consume(req.ip as string);
		next();
		}
		catch{
		res.status(429).json({status:'error',message: 'Too many request. Please try again later', data: null});
		}
	}
}



export const loginRateLimit = createRateLimitMiddleware(authLimiter);
export const registerRateLimit = createRateLimitMiddleware(authLimiter);
export const passwordRateLimit = createRateLimitMiddleware(authLimiter);
