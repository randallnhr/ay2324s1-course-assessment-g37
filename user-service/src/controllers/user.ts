import { Request, Response, RequestHandler, NextFunction } from "express";
import * as userService from "../services/user";
import { query, validationResult } from "express-validator";
import { User } from "../models/user";

// express validator schema
const userSchema = {};

export const getUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const username: string = req.params.username;
  let result;

  try {
    result = await userService.getUser(username);
  } catch (error) {
    next(error);
  }

  res.status(200).json(result);
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = {
    username: req.body.username,
    displayName: req.body.displayName,
    password: req.body.password,
    role: "basic", // Admin role have to be done manually
  };

  try {
    await userService.createUser(user);
  } catch (error: any) {
    if (error.code == "23505") {
      res.sendStatus(422);
      return;
    }

    next(error);
  }

  res.sendStatus(200);
};

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = {
    username: req.body.username,
    displayName: req.body.displayName,
    password: req.body.password,
    role: req.body.role,
  };

  try {
    await userService.updateUser(user);
  } catch (error) {
    next(error);
  }

  res.sendStatus(200);
};

export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const username = req.params.username;

  try {
    await userService.deleteUser(username);
  } catch (error) {
    next(error);
  }

  res.sendStatus(200);
};
