import {z} from 'zod';

const registerUserSchema = z.object({
	name: z.string(),
	email: z.email({error: "Invalid email address"}),
	password: z.string().min(8,'Password too short')
});

type RegisterUser = z.infer<typeof registerUserSchema>;

		


export {registerUserSchema, RegisterUser}