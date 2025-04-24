import { QueryFailedError } from "typeorm"

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
      if (!(error instanceof QueryFailedError)) {
        throw error
      }

      result = error
      retries++
    }
  }

  throw result
}
