import { Request, Response, RequestHandler } from "express";
import * as userService from "../services/user";
import { User } from "../models/user";

export const getUser: RequestHandler = async (req: Request, res: Response) => {
  const username = req.params.username;

  const result = await userService.getUser(username);
  res.status(200).json(result);
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const user: User = {
    username: req.body.username,
    displayName: req.body.displayName,
    password: req.body.password,
    role: "basic", // Admin role have to be done manually
  };

  const result = await userService.createUser(user);
  res.sendStatus(200);
};

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const user: User = {
    username: req.body.username,
    displayName: req.body.displayName,
    password: req.body.password,
    role: req.body.role,
  };

  const result = await userService.updateUser(user);
  res.sendStatus(200);
};

export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const username = req.params.username;

  const result = await userService.deleteUser(username);
  res.sendStatus(200);
};
