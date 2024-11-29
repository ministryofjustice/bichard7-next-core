import Pino from "pino"

const logger: Pino.Logger = Pino({
  base: null, // This prevents the logger emitting some default attributes like the hostname which we don't need
  enabled: process.env.NODE_ENV !== "test",
  level: process.env.PINO_LOG_LEVEL || "info",
  messageKey: "message",
  timestamp: false
})

export default logger
