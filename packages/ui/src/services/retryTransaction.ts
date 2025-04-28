import { QueryFailedError } from "typeorm"
import logger from "utils/logger"

export const retryTransaction = async <T, Args extends unknown[]>(
  callback: (...args: Args) => Promise<T>,
  ...callbackArgs: Args
): Promise<T> => {
  const maxRetries = 2
  let retries = 0
  let result

  while (retries < maxRetries) {
    try {
      return await callback(...callbackArgs)
    } catch (error) {
      const errorForLog = error as Error
      logger.error(`Error inside transaction (retry: ${retries}): ${errorForLog.name} - ${errorForLog.message}`)

      if (!(error instanceof QueryFailedError)) {
        throw error
      }

      result = error
      retries++
    }
  }

  throw result
}
