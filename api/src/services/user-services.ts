import { RegisterUser } from '../shared/user-schema';
import {prisma} from '../configs/prisma';


const safeSelect =  {
			id: true,
			email: true,
			name: true
		}

export const createUser = async (userData: RegisterUser) => {
	return await prisma.user.create({
		data: userData,
		select: safeSelect
	});
}


export const findAllUsers = async () => {
	return await prisma.user.findMany({
		select: safeSelect
	});
}

export const updateUserPassword = async (id: string, password: string) => {
	return await prisma.user.update({
		where: {
			id
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
