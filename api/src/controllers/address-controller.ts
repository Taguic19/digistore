import { NextFunction, Response } from "express";
import { type AddressBody, addressBodySchema, CustomerAddress } from "@/shared/address-types";
import { AuthRequest } from "@/middlewares/auth-middleware";
import { BadRequestError, NotFoundError } from "@/shared/app-error";
import { getAuthUser } from "@/utils/auth-guard";
import { createAddressService, deleteAddressByIdService, findAddressByIdService, findAllAddressService, updateAddressStatusService } from "@/services/address-service";
import { Params, paramsSchema } from "@/shared/user-schema";

export const createAddressController = async(req: AuthRequest<{},{}, AddressBody>, res: Response, next: NextFunction) => {
	try{
		const signedUser = getAuthUser(req);
		const result = addressBodySchema.safeParse(req.body);
		if(!result.success) {
			throw new BadRequestError('Data Provided is invalid');
		}
		const addressData: CustomerAddress = {
			userId: signedUser.id,
			...result.data

		}
		const address = await createAddressService(addressData);

		res.status(201).json({status: 'success', message: 'New Address added', data: {
			addressId: address.id
		} });
	}
	catch(err) {
		next(err);
	}
}

export const getAllAddressController = async(req: AuthRequest, res: Response, next: NextFunction) => {
	try{
		const signedUser = getAuthUser(req);
		const addresses = await findAllAddressService(signedUser.id);
		
		res.status(200).json({status: 'success',message: 'Address Fetched', data: {
			addresses
		}});

	}
	catch(err) {
		next(err);
	}
}

export const deleteAddressController = async (req: AuthRequest<Params>, res: Response, next: NextFunction) => {
	try{

	const result = paramsSchema.safeParse(req.params);
	if(!result.success) {
		throw new BadRequestError('Parameter Format is malformed');
	}

	const deletedAddress = await deleteAddressByIdService(result.data.id);

	if(!deletedAddress) {
		throw new Error('Failed to delete address');
	}

	res.status(200).json({status: 'success',message: 'Address Deleted successfully', data: {deletedAddressId: deletedAddress.id}});

	}
	catch(err) {
		next(err);
	}
}

export const updateAddressStatusController = async (req: AuthRequest<Params>, res: Response, next: NextFunction) => {
	try{
	const result = paramsSchema.safeParse(req.params);
	if(!result.success) {
		throw new BadRequestError('Parameter format is malformed');
	}
	const signedUser = getAuthUser(req);
	const address = await findAddressByIdService(result.data.id, signedUser.id);
	if(!address) {
		throw new NotFoundError('Address not found');
	}

	const [_,updatedAddress] = await updateAddressStatusService(signedUser.id,address.id);

	if(!updatedAddress) {
		throw new Error('Failed to Update Address Status');
	}
	res.status(200).json({status: 'success', message: 'Default Address was updated', data: {
		updatedAddressId: address.id
	}});
	}
	catch(err) {
		next(err);
	}
}

