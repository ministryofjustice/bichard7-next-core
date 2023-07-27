export type Result<T> = T | Error
export type PromiseResult<T> = Promise<Result<T>>

export function isError<T>(result: Result<T>): result is Error {
  return result instanceof Error
}
