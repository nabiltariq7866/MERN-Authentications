import express from 'express';
import { config } from 'dotenv';
config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/dbConnection.js';
import userRouter from "./routes/user.routes.js"
import { removeUnverifiedAccounts } from './automation/removeUnverifiedAccount.js';

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));


app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRouter);
removeUnverifiedAccounts();
connectDB();