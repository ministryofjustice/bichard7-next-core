import type TransactionFailedError from "../../../../types/errors/TransactionFailedError"

export default function isTransactionFailedError(error: Error): error is TransactionFailedError {
  return "failureReasons" in error
}
