import { getAllUsersController, registerUserController, updatePasswordController, updateUserNameController } from "@/controllers/user-controller";
import { Router } from "express";
import { authenticate } from "@/middlewares/auth-middleware";
import { authorize } from "@/middlewares/authorize";


const userRouter: Router = Router();

userRouter.post('/',registerUserController);
userRouter.get('/',authenticate,authorize('CUSTOMER'), getAllUsersController);
userRouter.put('/password', authenticate, updatePasswordController);
userRouter.put('/name', authenticate, updateUserNameController);

export default userRouter;