import type { NextFunction, Request, Response } from "express";
import { createUser,updateUserName, updateUserPassword, findAllUsers , deleteUserById, findUserByEmail, findUserById  } from "@/services/user-services";
import { registerUserSchema, type RegisterUser, paramsSchema , updatePasswordSchema, Password} from "@/shared/user-schema";
import { NotFoundError, BadRequestError, ConflictError, UnauthorizedError } from "@/shared/app-error";
import { comparePassword, hashPassword } from "@/utils/password";
import { StatusCodes } from "http-status-codes";
import { PaginationQuery } from "@/shared/request-types";
import { AuthRequest } from "@/middlewares/auth-middleware";
import { getAuthUser } from "@/utils/auth-guard";

export const registerUserController = async (req: Request<{},{},RegisterUser >, res: Response,next: NextFunction) => {
	try{
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

	}
	catch(err) {
		next(err);
	}
};


export const getAllUsersController = async (req: AuthRequest<{},{},{},PaginationQuery >, res: Response, next: NextFunction) => {
	try{
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
	}
	catch(err) {
		next(err);
	}
};


export const updateUserNameController = async (req: AuthRequest<{},{}, {name: string}>, res: Response, next: NextFunction) => {
	try{
	const {id} = getAuthUser(req);
	const name = req.body.name;
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
	}	
	catch(err) {
		next(err);
	}
};

export const updatePasswordController = async (req: AuthRequest<{},{}, Password>, res: Response, next: NextFunction) => {
	try{
	const {email} = getAuthUser(req);
	const result = updatePasswordSchema.safeParse(req.body);
	if(!result.success) {
		throw new BadRequestError('Data provided is invalid');
	}

	const matchedUser = await findUserByEmail(email);
	if(!matchedUser) {
		throw new NotFoundError('User not found');
	}

	const isMatchedPassword = await comparePassword(result.data.password, matchedUser.password);
	if(!isMatchedPassword) {
		throw new UnauthorizedError('Password dont match');
	}

	const hashedPassword = await hashPassword(result.data.newPassword);

	const updatedUser = await updateUserPassword(email, hashedPassword);

	if(!updatedUser) {
		throw new Error('Error Updating Password');
	}

	res.status(200).json({status: 'success', message: 'Password Updated'});

	}
	catch(err) {
		next(err);
	}
};
