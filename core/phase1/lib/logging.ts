import Pino from "pino"

const logger: Pino.Logger = Pino({
  level: process.env.PINO_LOG_LEVEL || "info",
  timestamp: false,
  messageKey: "message"
})

export default logger
