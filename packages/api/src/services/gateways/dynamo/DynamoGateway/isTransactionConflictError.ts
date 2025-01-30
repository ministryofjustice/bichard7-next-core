import isTransactionFailedError from "./isTransactionFailedError"

export default function isTransactionConflictError(error: Error): boolean {
  if (isTransactionFailedError(error)) {
    return error.failureReasons && error.failureReasons.some((reason) => reason.Code == "TransactionConflict")
  }

  return error.name === "TransactionConflictException"
}
