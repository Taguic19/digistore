import { getAllUsersController, registerUserController, updatePasswordController, updateUserNameController } from "@/controllers/user-controller";
import { Router } from "express";
import { authenticate } from "@/middlewares/auth-middleware";
import { authorize } from "@/middlewares/authorize";


const userRouter: Router = Router();

userRouter.post('/',registerUserController);
userRouter.get('/',authenticate,authorize('CUSTOMER'), getAllUsersController);
userRouter.put('/', authenticate, updatePasswordController);
userRouter.put('/:id', authenticate, updateUserNameController);

export default userRouter;