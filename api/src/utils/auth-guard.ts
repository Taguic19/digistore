import { AuthRequest } from "@/middlewares/auth-middleware";
import { UnauthorizedError } from "@/shared/app-error";


export const getAuthUser = (req: AuthRequest) => {
	const user = req.user;
	if(!user) {
		throw new UnauthorizedError('User not authenticated');
	}
	return user;
	
}