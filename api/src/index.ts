import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware, notFoundHandler } from './middlewares/error-middleware';
import userRouter from './routes/user-routes';
import authRouter from './routes/auth-routes';
import { env } from './configs/env';
import addressRouter from './routes/address-routes';

const PORT = env.PORT ?? 3501;
const app = express();

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cors({credentials: true}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


app.get('/', (req: Request, res: Response) => {
	res.send('Hello');
});	

app.use('/api/v1/users',userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/address', addressRouter);

app.use(notFoundHandler);
app.use(errorMiddleware);

app.listen(PORT, () => console.info(`Server running on PORT: ${PORT}`));







