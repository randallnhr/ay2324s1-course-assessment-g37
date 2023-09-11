import { Request, Response, RequestHandler } from "express";
import * as userService from "../services/user";
import { User } from "../models/user";

export const getUser: RequestHandler = (req: Request, res: Response) => {
  const username = req.params.username;

  const result = userService.getUser(username);
  res.json(result);
};

export const createUser: RequestHandler = (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    displayName: req.body.displayName,
  };

  const result = userService.createUser(user);
  res.json(result);
};

export const updateUser: RequestHandler = (req: Request, res: Response) => {
  const username = req.body.username;
  const displayName = req.body.displayName;

  const result = userService.updateUser(username, displayName);
  res.json(result);
};

export const deleteUser: RequestHandler = (req: Request, res: Response) => {
  const username = req.params.username;

  const result = userService.deleteUser(username);
  res.json(result);
};
