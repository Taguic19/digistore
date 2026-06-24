import { prisma } from "@/configs/prisma";
import { CustomerAddress } from "@/shared/address-types";



export const createAddressService = async (addressData: CustomerAddress) => {
	return await prisma.address.create({
		data: addressData
	});
}

export const findAllAddressService = async (userId: string) => {
	return await prisma.address.findMany({
		orderBy: {
			createdAt: "desc"
		},
		where: {userId}
	});
}

export const deleteAddressByIdService = async (id: string) => {
	return await prisma.address.delete({
		where: {
			id
		}
	});
}

export const updateAddressService = async (id: string, addressData: Partial<Omit<CustomerAddress, 'userId'>>) => {
	return await prisma.address.update({
		where: {id},
		data: addressData
	});
}

export const findAddressByIdService = async (addressId: string, userId: string) => {
	return await prisma.address.findFirst({
		where: {userId,id: addressId}
	})
}

export const updateAddressStatusService = async (userId: string, addressId: string) => {
	return await prisma.$transaction([
		prisma.address.updateMany({
			where: {userId},
			data: {isDefault: false}
		}),
		prisma.address.update({
			where: {id: addressId},
			data: {isDefault: true}
		})
	]);
}








