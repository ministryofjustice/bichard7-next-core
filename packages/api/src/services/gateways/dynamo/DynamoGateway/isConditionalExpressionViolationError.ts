import isTransactionFailedError from "./isTransactionFailedError"

export default function isConditionalExpressionViolationError(error: Error): boolean {
  if (isTransactionFailedError(error)) {
    return error.failureReasons && error.failureReasons.some((reason) => reason.Code == "ConditionalCheckFailed")
  }

  return error.name === "ConditionalCheckFailedException"
}
