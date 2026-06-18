import asyncHandler from "express-async-handler";
import type { Request, RequestHandler, Response } from "express";
import { createUser,updateUserName, updateUserPassword, findAllUsers , deleteUserById, findUserByEmail, findUserById  } from "@/services/user-services";
import { registerUserSchema, type RegisterUser, paramsSchema , updatePasswordSchema, Password} from "@/shared/user-schema";
import { NotFoundError, BadRequestError, ConflictError } from "@/shared/app-error";
import { hashPassword, comparePassword } from "@/utils/password";
import { StatusCodes } from "http-status-codes";
import { PaginationQuery } from "@/shared/request-types";

export const registerUserController = asyncHandler(async (req: Request<{},{},RegisterUser >, res: Response) => {
	const result = registerUserSchema.safeParse(req.body);
	if(!result.success) {
		throw new BadRequestError('Data Provided is invalid');
	}
	const matchedEmail = await findUserByEmail(result.data.email);
	if(matchedEmail) {
		throw new ConflictError('Email already taken');
	}
	const userData: RegisterUser = {
		...result.data,
		password: await hashPassword(result.data.password)
	}

	const createdUser = await createUser(userData);

	if(!createdUser) {
		throw new Error('Error while creating user');
	}

	res.status(StatusCodes.CREATED).json({message: 'User Created', userId: createdUser.id, status: 'success'});

});


export const getAllUsersController = asyncHandler(async (req: Request<{},{},{},PaginationQuery >, res: Response) => {
	const page = Number(req.query.page) || 1;
	const size = Number(req.query.size) || 10;

	const result = await findAllUsers(page,size);
	if(!result) {
		throw new Error('Error Fetching Users');
	}
	res.status(200).json({
		status: 'success',
		message: 'User Fetched Successfully',
		users: result.users,
		meta: result.meta
	});
});


export const updateUserNameController = asyncHandler(async (req: Request<{id: string},{}, {name: string}>, res: Response) => {
	const name = req.body.name;
	const result = paramsSchema.safeParse(req.params);

	if(!result.success) {
		throw new BadRequestError('Invalid user id');
	}

	const {id} = req.params;

	
	const namePattern = /^[^0-9]*/;
	
	const isValid = namePattern.test(name);

	if(!isValid) {
		throw new BadRequestError('Name cannot contain number or characters');
	}

	const updatedUser = await updateUserName(id,name);

	if(!updatedUser) {
		throw new Error('Failed to update user name');
	}

	res.sendStatus(204);
});

export const updatePasswordController = asyncHandler(async (req: Request<{},{}, Password>, res: Response) => {

	const result = updatePasswordSchema.safeParse(req.body);
	if(!result.success) {
		throw new BadRequestError('Data provided is invalid ngani');
	}

});
