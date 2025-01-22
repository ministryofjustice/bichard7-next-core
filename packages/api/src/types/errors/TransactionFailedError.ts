import type FailureReason from "../TransactionFailureReason"

export default class TransactionFailedError extends Error {
  __proto__: Error

  failureReasons: FailureReason[]

  constructor(failureReasons: FailureReason[], message?: string) {
    const trueProto = new.target.prototype
    super(message)

    this.failureReasons = failureReasons
    this.__proto__ = trueProto
  }
}
