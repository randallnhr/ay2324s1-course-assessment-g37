import * as db from "../db";
import { User } from "../models/user";

export const getUser = async (username: string) => {
  const text = "SELECT * FROM users WHERE username = $1";
  const values = [username];

  const result = await db.query(text, values);
  return result;
};

export const createUser = async (user: User) => {
  const text = "INSERT INTO users VALUES($1, $2)";
  const values = [user.username, user.displayName];

  const result = await db.query(text, values);
  return result;
};

export const updateUser = async (username: string, displayName: string) => {
  const text = "UPDATE users SET displayName = $1 WHERE username = $2";
  const values = [displayName, username];

  const result = await db.query(text, values);
  return result;
};

export const deleteUser = async (username: string) => {
  const text = "DELETE FROM users WHERE username = $1";
  const values = [username];

  const result = await db.query(text, values);
  return result;
};
