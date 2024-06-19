export default class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly originalError: Error
  ) {
    super(message)
  }
}

export class NotFoundError extends Error {}

export class AlreadyExistsError extends Error {}
