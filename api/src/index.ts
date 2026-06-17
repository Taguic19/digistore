import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


dotenv.config();

const PORT = process.env.PORT ?? 3500;

const app = express();

app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


app.get('/', (req: Request, res: Response) => res.json({message: "Hello from Express"}));


app.listen(PORT, () => console.info(`Server running on PORT: ${PORT}`));







