import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {prisma} from './configs/prisma'



const PORT = process.env.PORT ?? 3500;

const app = express();

app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


app.get('/',async (req: Request, res: Response) => {
	const users = await prisma.user.findMany();
	res.json(users);
});


app.listen(PORT, () => console.info(`Server running on PORT: ${PORT}`));







