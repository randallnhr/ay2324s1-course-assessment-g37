import express, { Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";

dotenv.config();
const app = express();
app.use("/api/user", userRoutes);
export default app;
