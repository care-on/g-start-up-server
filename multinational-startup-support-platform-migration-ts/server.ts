import app from "./app";
import logger from "./configs/logger.config";
import { redis } from "./configs/redis.config";
import { SERVER } from "./constants/env.constant";

const port = SERVER.PORT;
app.listen(port, async () => {
  try {
    logger.info(`server open`);
  } catch (err) {
    throw err;
  }
});
redis.on("ready", () => {
  logger.info("redis open");
});
