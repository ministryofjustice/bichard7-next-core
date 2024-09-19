import type { LoggerOptions } from "pino"

type Options = LoggerOptions | boolean

const logger = (env?: string) => {
  let loggerOpts: Options

  switch (env) {
    case "test":
      loggerOpts = false
      break
    case "dev":
    case "development":
      loggerOpts = {
        transport: {
          target: "pino-pretty",
          options: {
            destination: 1,
            colorize: true,
            translateTime: "HH:MM:ss.l",
            ignore: "pid,hostname"
          }
        }
      }
      break
    default:
      loggerOpts = true
      break
  }

  return loggerOpts
}

export default logger
