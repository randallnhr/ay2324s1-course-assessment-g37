import createError from "http-errors";
import express, { Express, Request, Response, NextFunction } from 'express';
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

const questionsRouter = require('./routes/questions');

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/questions', questionsRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // respond with 404
  res.status(err.status || 500).end();
});

export default app;
