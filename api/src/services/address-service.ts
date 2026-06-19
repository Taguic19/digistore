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








