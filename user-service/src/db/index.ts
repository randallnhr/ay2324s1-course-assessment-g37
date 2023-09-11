import { Pool, QueryArrayConfig } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// pools will use environment variables
// for connection information
const pool = new Pool({
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query(
  "CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, display_name TEXT);"
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
