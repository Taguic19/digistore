import { hash, compare } from "bcrypt";


const hashPassword = async (password: string): Promise<string> => {
	return await hash(password,10);
}

const comparePassword = async(password: string, hashedPassword: string): Promise<boolean> => {
	return await compare(password,hashedPassword);
}

export {hashPassword, comparePassword}