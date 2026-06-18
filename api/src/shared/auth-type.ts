import z from "zod";


const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8)
});

type LoginData = z.infer<typeof loginSchema>;

export {loginSchema, LoginData};


