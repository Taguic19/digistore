import { deleteAddressController,createAddressController, getAllAddressController, updateAddressStatusController } from "@/controllers/address-controller";
import { Router } from "express";
import { authenticate } from "@/middlewares/auth-middleware";

const addressRouter: Router = Router();

addressRouter.post('/',authenticate, createAddressController);
addressRouter.get('/', authenticate, getAllAddressController);
addressRouter.delete('/:id', authenticate, deleteAddressController);
addressRouter.put('/:id', authenticate, updateAddressStatusController);


export default addressRouter;