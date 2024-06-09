import mysql, { PoolOptions } from "mysql2";
import { DB } from "../constants/env.constant";
import { Pool } from "mysql2/promise";
const config_db_connection_pool: PoolOptions = {
  host: DB.HOST,
  port: DB.PORT,
  user: DB.USER,
  password: DB.PASSWORD,
  database: DB.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
const connection_pool: Pool = mysql
  .createPool(config_db_connection_pool)
  .promise();

export { connection_pool };
