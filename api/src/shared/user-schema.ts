import {z} from 'zod';

const registerUserSchema = z.object({
	name: z.string(),
	email: z.email({error: "Invalid email address"}),
	password: z.string().min(8,'Password too short')
});

const paramsSchema = z.object({
	id: z.string().regex(/^c[a-z0-9]{24}$/,'Invalid User id')
});


const updatePasswordSchema = z.object({
	password: z.string().min(8),
	newPassword: z.string().min(8)
});

type Password = z.infer<typeof updatePasswordSchema>;


type RegisterUser = z.infer<typeof registerUserSchema>;


export interface ReturnedUser {
	id: string;
	name: string | null;
	email: string;
	role: 'CUSTOMER' | 'ADMIN'
}

export interface PaginationMetaData {
	total: number;
	defaultPage: number;
	size: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface PaginatedUser {
	users: ReturnedUser[],
	meta: PaginationMetaData
}
		


export {registerUserSchema, RegisterUser,paramsSchema, updatePasswordSchema, Password}

