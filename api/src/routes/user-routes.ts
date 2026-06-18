import { getAllUsersController, registerUserController, updatePasswordController, updateUserNameController } from "@/controllers/user-controller";
import { Router } from "express";

const userRouter: Router = Router();

userRouter.post('/',registerUserController);
userRouter.get('/', getAllUsersController);
userRouter.put('/', updatePasswordController);
userRouter.put('/:id', updateUserNameController);

export default userRouter;