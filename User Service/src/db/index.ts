import { Pool, QueryArrayConfig } from "pg";

const pool = new Pool();
pool.query(
  "CREATE TABLE IF NOT EXIST users(username TEXT PRIMARY KEY, display_name TEXT);"
);

export const query = async (
  text: string | QueryArrayConfig<any>,
  params: string[]
) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};
