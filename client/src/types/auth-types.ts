import {z} from 'zod';

const loginSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(8,'Password too short'),
});

const registerSchema = z.object({
	email: z.email('Invalid email address'),
	name: z.string().min(1,'Name is required'),
	password: z.string().min(8,'Password too short'),
	confirmPassword: z.string().min(8, 'Password too short'),
	role: z.enum(['CUSTOMER','SELLER'])
}).refine(data => data.password === data.confirmPassword, {
	message: 'Passwords dont match',
	path: ['confirmPassword']
});


type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;


export {loginSchema, registerSchema, LoginData, RegisterData}

