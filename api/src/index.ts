import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {prisma} from './configs/prisma'
import { errorMiddleware, notFoundHandler } from './middlewares/error-middleware';
import userRouter from './routes/user-routes';


const PORT = process.env.PORT ?? 3500;

const app = express();

app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


app.get('/', (req: Request, res: Response) => {
	res.send('Hello');
});	

app.use('/api/v1/users',userRouter);

app.use(notFoundHandler);
app.use(errorMiddleware);

app.listen(PORT, () => console.info(`Server running on PORT: ${PORT}`));







