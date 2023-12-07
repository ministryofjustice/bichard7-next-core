import Pino from "pino"

const logger: Pino.Logger = Pino({
  level: process.env.PINO_LOG_LEVEL || "info",
  timestamp: false,
  messageKey: "message",
  enabled: process.env.NODE_ENV !== "test",
  base: null // This prevents the logger emitting some default attributes like the hostname which we don't need
})

export default logger
