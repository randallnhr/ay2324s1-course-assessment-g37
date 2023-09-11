import createError from "http-errors";
import dotenv from  "dotenv";
import express, { Express, Request, Response } from 'express';
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import { ROUTE_QUESTIONS, router as questionsRouter } from "./routes/questions";
import { CODE_BAD_REQUEST, CODE_INTERNAL_SERVER_ERROR } from "./utility";

// read environment variables
dotenv.config()

// database set up
// The URI should look like "mongodb+srv://admin:<password>@<clusterxx.yyyyyy>.mongodb.net/test?retryWrites=true&w=majority"
const mongoDbUri = process.env.MONGO_URI;
if (!mongoDbUri) {
  console.log("MongoDB atlas URI not found in environment");
} else {
  mongoose.connect(mongoDbUri);
}

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(ROUTE_QUESTIONS, questionsRouter);

// catch 400 and forward to error handler
app.use(function(req: Request, res: Response, next) {
  next(createError(CODE_BAD_REQUEST));
});

// error handler
app.use(function(err: any, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // respond with 400
  res.status(err.status || CODE_INTERNAL_SERVER_ERROR).end();
});

export default app;
