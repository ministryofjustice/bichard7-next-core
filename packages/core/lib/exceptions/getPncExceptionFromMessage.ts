import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/types/ExceptionCode"

import type { PncException } from "../../types/Exception"

import errorPaths from "./errorPaths"

export type ErrorRangeDefinition = {
  code: ExceptionCode
  ranges: ErrorRange[]
}

type ErrorRange = {
  end?: string
  start: string
}

const inErrorRange = (code: string, ranges: ErrorRange[]): boolean =>
  ranges.some(({ start, end }) => {
    if (end) {
      return code >= start && code <= end
    }

    return code === start
  })

const getPncExceptionFromMessage = (
  message: string,
  errorRanges: ErrorRangeDefinition[],
  defaultException: ExceptionCode
): PncException => {
  const errorCode = message.substring(0, 5)

  for (const { code, ranges } of errorRanges) {
    if (inErrorRange(errorCode, ranges)) {
      return { code, path: errorPaths.case.asn, message }
    }
  }

  return { code: defaultException, path: errorPaths.case.asn, message }
}

export default getPncExceptionFromMessage
