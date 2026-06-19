import { PaginatedUser, RegisterUser } from '../shared/user-schema';
import {prisma} from '../configs/prisma';


const safeSelect =  {
			id: true,
			email: true,
			name: true,
			role: true
		}

export const createUser = async (userData: RegisterUser) => {
	return await prisma.user.create({
		data: userData,
		select: safeSelect
	});
}


export const findAllUsers = async (page: number, size: number = 10): Promise<PaginatedUser> => {
	const defaultPage = Math.max(1,page);
	const skip = (defaultPage -1 ) * size;
	const [users, total] = await prisma.$transaction([
		prisma.user.findMany({
			select: safeSelect,
			take: size,
			skip,
			orderBy: {createdAt: 'asc'}
		}),
		prisma.user.count()
	]);

	return {
		users,
		meta: {
			total,
			defaultPage,
			size,
			totalPages: Math.ceil(total / size),
			hasNextPage: defaultPage < Math.ceil(total / size),
			hasPreviousPage: defaultPage > 1
		}
	}
}

export const updateUserPassword = async (email: string, password: string) => {
	return await prisma.user.update({
		where: {
			email
		},
		data: {
			password
		},
		select: safeSelect
	});
}

export const findUserById = async (id: string) => {
	return await prisma.user.findUnique({
		where: {id},
		select: safeSelect
	});
}

export const updateUserName = async (id: string, name: string) => {
  return await prisma.user.update({
    where: { id },
    data: { name },	
    select: safeSelect
  })
}

export const deleteUserById = async (id: string) => {
	return await prisma.user.delete({
		where: {id},
		select: safeSelect
	});
}

export const findUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {email},
		select: {
			...safeSelect,
			password: true
		}
	})
}
