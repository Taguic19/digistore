import { Request, Response, NextFunction } from "express";
import { loginSchema, type LoginData  } from "@/shared/auth-type";
import { UnauthorizedError, BadRequestError } from "@/shared/app-error";
import { findUserByEmail, findUserById } from "@/services/user-services";
import type { UserPayload } from "@/shared/user-schema";
import { comparePassword } from "@/utils/password";
import { generateAccessToken, generateRefreshToken, setAuthCookies } from "@/utils/tokens";
import jwt from 'jsonwebtoken';


const loginUserController = async (req: Request<{},{},LoginData >, res: Response, next: NextFunction) => {
	try{
	const result = loginSchema.safeParse(req.body);
	if(!result.success) {
		throw new BadRequestError('Data Provided is invalid');
	}
	const {email, password} = result.data;
	const matchedUser = await findUserByEmail(email);

	if(!matchedUser) {
		throw new UnauthorizedError('Email or Password is invalid');
	}

	const {id, role, password: hashedPassword} = matchedUser;

	const isMatchedPassword = await comparePassword(password, hashedPassword);
	if(!isMatchedPassword) {
		throw new UnauthorizedError('Email or Password is invalid');
	}
	const payload: UserPayload = {
		id, email,role
	}

	const accessToken = generateAccessToken(payload);
	const refreshToken = generateRefreshToken({id});
	setAuthCookies(res,accessToken, refreshToken);

	res.status(200).json({status: 'success', message: 'Login successfully', data: null});
	}
	catch(err) {
		next(err);
	}

}



const logoutController = async (req: Request, res: Response, next: NextFunction) => {
	try{
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		res.status(200).json({ status: 'success', message: 'Logged out successfully',data: null });
	}
	catch(err) {
		next(err);
	}
}


const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
	try{
	const refreshToken = req.cookies.refreshToken as string;
	if(!refreshToken) {
		throw new UnauthorizedError('Missing Refresh Token');
	}

	const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as {id: string};	

	const user = await findUserById(payload.id);
	if(!user) {
		throw new UnauthorizedError('User not found');
	}
	const {name, ...userPayload} = user;

	const newAccessToken = generateAccessToken(userPayload);
	const newRefreshToken = generateRefreshToken({id: userPayload.id});
	setAuthCookies(res,newAccessToken,newRefreshToken);
	res.status(200).json({ status: 'success', message: 'Token refreshed',data: null });
	}
	catch(err) {
		next(err);
	}
}

export {loginUserController, logoutController, refreshTokenController}