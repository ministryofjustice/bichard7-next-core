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
  const maxRetries = 2
  let attempt = 0
  let lastError: unknown

  while (attempt < maxRetries) {
    try {
      return await callback(...callbackArgs)
    } catch (error) {
      const errorForLog = error as Error
      logger.error(`Error inside transaction (retry: ${attempt}): ${errorForLog.name} - ${errorForLog.message}`)

      if (!isRetryableError(error) || attempt >= maxRetries - 1) {
        throw error
      }

      await delay(randomInt(0, 100) * (attempt + 1))
      attempt++
    }
  }

  throw lastError
}
