import type TransactionFailedError from "../../../../types/TransactionFailedError"

export default function isTransactionFailedError(error: Error): error is TransactionFailedError {
  return "failureReasons" in error
}
