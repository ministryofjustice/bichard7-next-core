import type { FastifyBaseLogger } from "fastify"
import type pino from "pino"
import type { LevelWithSilentOrString } from "pino"

export default class FakeLogger implements FastifyBaseLogger {
  level: LevelWithSilentOrString = "silent"
  silent: pino.LogFn

  child() {
    return this as unknown as FastifyBaseLogger
  }
  debug(..._args: unknown[]) {}
  error(..._args: unknown[]) {}
  fatal(..._args: unknown[]) {}
  info(..._args: unknown[]) {}
  trace(..._args: unknown[]) {}
  warn(..._args: unknown[]) {}
}
