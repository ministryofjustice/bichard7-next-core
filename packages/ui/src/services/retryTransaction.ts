import { QueryFailedError } from "typeorm"
import logger from "utils/logger"
import { randomInt } from "node:crypto"

const SERIALIZATION_ERROR_CODES = new Set(["40001", "40P01"])

const isRetryableError = (error: unknown): boolean => {
  if (!(error instanceof QueryFailedError)) {
    return false
  }

  const code = (error as QueryFailedError & { code?: string }).code
  return !!code && SERIALIZATION_ERROR_CODES.has(code)
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const retryTransaction = async <T, Args extends unknown[]>(
  callback: (...args: Args) => Promise<T>,
  ...callbackArgs: Args
): Promise<T> => {
  const maxRetries = 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      return await callback(...callbackArgs)
    } catch (error) {
      const errorForLog = error as Error

      if (!isRetryableError(error) || attempt >= maxRetries - 1) {
        logger.error(`Error inside transaction (retry: ${attempt}): ${errorForLog.name} - ${errorForLog.message}`)
        throw error
      }

      logger.warn(`Error inside transaction (retry: ${attempt}): ${errorForLog.name} - ${errorForLog.message}`)

      await delay(randomInt(50, 150) * (attempt + 1))
      attempt++
    }
  }

  logger.error("Retry transaction failed")
  throw new Error("Retry transaction failed")
}
