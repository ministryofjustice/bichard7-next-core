export type Result<T> = Error | T

export function isError<T>(result: Result<T>): result is Error {
  return result instanceof Error
}
