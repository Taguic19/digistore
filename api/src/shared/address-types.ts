import z from "zod";


export const addressSchema = z.object({
	userId: z.string().regex(/^c[a-z0-9]{24}$/,'Invalid User id'),
	street: z.string(),
	municipality: z.string(),
	province: z.string(),
	postalCode: z.string(),
});


export type CustomerAddress = z.infer<typeof addressSchema>;
