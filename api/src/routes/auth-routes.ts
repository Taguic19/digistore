import { loginUserController, logoutController, refreshTokenController } from "@/controllers/auth-controller";
import { Router } from "express";

const authRouter: Router = Router();

authRouter.post('/login', loginUserController);
authRouter.post('/logout',logoutController);
authRouter.post('/refresh', refreshTokenController);

export default authRouter;
