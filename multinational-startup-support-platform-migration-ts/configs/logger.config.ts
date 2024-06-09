import winston, { Logger } from "winston";

interface LogLevels {
  [key: string]: number;
}

const levels: LogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = (): string => {
  const env: string = process.env.NODE_ENV || "development";
  const isDevelopment: boolean = env === "development";
  return isDevelopment ? "debug" : "warn";
};

interface LogColors {
  [key: string]: string;
}

const colors: LogColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.label({ label: "care-on service" }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [ ${info.level} ]: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "/tmp/winston/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "/tmp/winston/all.log" }),
];

const logger: Logger = winston.createLogger({
  level: level(),
  levels: levels as winston.LoggerOptions["levels"],
  format,
  transports,
});

export default logger;
