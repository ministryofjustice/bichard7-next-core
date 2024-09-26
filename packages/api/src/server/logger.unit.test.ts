import type { LoggerOptions } from "pino"
import logger from "./logger"

const loggerOpts: LoggerOptions = {
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

describe("logger", () => {
  it("will return true in given no arguments", () => {
    const result = logger()

    expect(result).toBe(true)
  })

  it("will return true in given 'prod'", () => {
    const result = logger("prod")

    expect(result).toBe(true)
  })

  it("will return true in given 'Production'", () => {
    const result = logger("Production")

    expect(result).toBe(true)
  })

  it("will return false in given 'TEST'", () => {
    const result = logger("TEST")

    expect(result).toBe(false)
  })

  it("will return false in given 'test'", () => {
    const result = logger("test")

    expect(result).toBe(false)
  })

  it("will return options in given 'dev'", () => {
    const result = logger("dev")

    expect(result).toEqual(loggerOpts)
  })

  it("will return options in given 'development'", () => {
    const result = logger("development")

    expect(result).toEqual(loggerOpts)
  })

  it("will return will ignore case sensitively", () => {
    const result = logger("deVeLOpmEnT")

    expect(result).toEqual(loggerOpts)
  })
})
