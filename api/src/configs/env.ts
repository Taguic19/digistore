import z from "zod";


const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  ACCESS_SECRET: z.string(),
  REFRESH_SECRET: z.string(),
});

const result = envSchema.safeParse(process.env);

if(!result.success) {
	console.log('Invalid Environment Variables');
	console.log(result.error.flatten().fieldErrors);
	process.exit(1);
}

export const env = result.data;
