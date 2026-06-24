import { deleteUserByIdController, getAllUsersController, registerUserController, updatePasswordController, updateUserNameController } from "@/controllers/user-controller";
import { Router } from "express";
import { authenticate } from "@/middlewares/auth-middleware";
import { authorize } from "@/middlewares/authorize";
import { passwordRateLimit, registerRateLimit } from "@/middlewares/rate-limiter";

const userRouter: Router = Router();

userRouter.post('/', registerRateLimit, registerUserController);
userRouter.get('/',authenticate,authorize('ADMIN'), getAllUsersController);
userRouter.put('/password',passwordRateLimit, authenticate, updatePasswordController);
userRouter.put('/name', authenticate, updateUserNameController);
userRouter.delete('/:id', authenticate, authorize('ADMIN'), deleteUserByIdController);


export default userRouter;