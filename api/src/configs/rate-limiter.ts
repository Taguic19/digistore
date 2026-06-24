import {RateLimiterMemory} from 'rate-limiter-flexible'


export const authLimiter = new RateLimiterMemory({
	points: 10,
	duration: 60 * 15
});

