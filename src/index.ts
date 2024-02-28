import express, { Express, json, urlencoded } from "express";
import { Request, Response, NextFunction} from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userUploadRoute from './router/index';
//import db from "./utils/db";

const app: Express = express();
dotenv.config();

mongoose.set('strictQuery', true);
app.use(cors({ origin: process.env.FRONTEND_PORT, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', userUploadRoute);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const errorStatus = (err as any).status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
  });

app.listen(process.env.PORT, () => {
  console.log(`✅ server started at http://localhost:${process.env.PORT}`);
//   db.connect();
});
