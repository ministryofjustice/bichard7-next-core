import Pino from "pino"
import config from "../lib/config"

const logger: Pino.Logger = Pino({
  name: `user-service-${process.env.NODE_ENV}`,
  level: config.debugMode === "true" ? "debug" : "info",
  timestamp: false,
  messageKey: "message"
})

export default logger
