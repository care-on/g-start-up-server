import dotenv from "dotenv";
dotenv.config();
type DB_TYPE = {
  HOST: string;
  PORT: number;
  NAME: string;
  USER: string;
  PASSWORD: string;
};
type TOKEN_TYPE = {
  ACCESS_SECRET: string;
  REFRESH_SECRET: string;
};
type MAIL_TYPE = {
  SERVICE: string;
  HOST: string;
  PORT: string;
  AUTH: {
    USER: string;
    PASSWORD: string;
  };
};
type SERVER_TYPE = {
  PORT: string;
};

const SERVER: SERVER_TYPE = {
  PORT: process.env.SERVER_PORT || "",
};

const DB: DB_TYPE = {
  HOST: process.env.DB_HOST || "",
  PORT: Number(process.env.DB_PORT) || 3306,
  NAME: process.env.DB_NAME || "",
  USER: process.env.DB_USER || "",
  PASSWORD: process.env.DB_PASSWORD || "",
};
const TOKEN: TOKEN_TYPE = {
  ACCESS_SECRET: process.env.ACCESS_SECRET || "",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "",
};
const MAIL: MAIL_TYPE = {
  SERVICE: process.env.MAIL_SERVICE || "",
  HOST: process.env.MAIL_HOST || "",
  PORT: process.env.MAIL_PORT || "",
  AUTH: {
    USER: process.env.MAIL_AUTH_USER || "",
    PASSWORD: process.env.MAIL_AUTH_PASSWORD || "",
  },
};

export { SERVER, DB, TOKEN, MAIL };
