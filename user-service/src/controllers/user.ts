import { Request, Response, RequestHandler } from "express";
import * as userService from "../services/user";
import { User } from "../models/user";

export const getUser: RequestHandler = async (req: Request, res: Response) => {
  const username = req.params.username;

  const result = await userService.getUser(username);
  res.json(result);
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const user: User = {
    username: req.body.username,
    displayName: req.body.displayName,
  };

  const result = await userService.createUser(user);
  res.status(200);
};

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const username = req.body.username;
  const displayName = req.body.displayName;

  const result = await userService.updateUser(username, displayName);
  res.status(200);
};

export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const username = req.params.username;

  const result = await userService.deleteUser(username);
  res.status(200);
};
