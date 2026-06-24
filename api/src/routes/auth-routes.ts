import { loginUserController, logoutController, refreshTokenController } from "@/controllers/auth-controller";
import { loginRateLimit } from "@/middlewares/rate-limiter";
import { Router } from "express";


const authRouter: Router = Router();

authRouter.post('/login',loginRateLimit, loginUserController);
authRouter.post('/logout',logoutController);
authRouter.post('/refresh', refreshTokenController);

export default authRouter;
