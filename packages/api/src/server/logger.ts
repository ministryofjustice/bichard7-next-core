import type { LoggerOptions } from "pino"

type Options = boolean | LoggerOptions

const logger = (env?: string): Options => {
  let loggerOpts: Options

  switch (env?.toLowerCase()) {
    case "dev":
    case "development":
      loggerOpts = {
        transport: {
          options: {
            colorize: true,
            destination: 1,
            ignore: "pid,hostname",
            translateTime: "HH:MM:ss.l"
          },
          target: "pino-pretty"
        }
      }
      break
    case "test":
      loggerOpts = false
      break
    default:
      loggerOpts = true
      break
  }

  return loggerOpts
}

export default logger
