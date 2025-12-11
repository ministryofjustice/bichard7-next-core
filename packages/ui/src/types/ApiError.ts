import type { Result } from "./Result"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function isApiError<T>(result: Result<T>): result is ApiError {
  return result instanceof ApiError
}
