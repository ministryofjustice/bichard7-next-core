import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/types/ExceptionCode"

import type { PncException } from "../../types/Exception"

import errorPaths from "./errorPaths"

export type PncErrorRangesForException = {
  code: ExceptionCode
  ranges: PncErrorRange[]
}

type PncErrorRange = {
  end?: string
  start: string
}

const inPncErrorRange = (pncErrorCode: string, pncErrorRanges: PncErrorRange[]): boolean =>
  pncErrorRanges.some(({ start, end }) => {
    if (end) {
      return pncErrorCode >= start && pncErrorCode <= end
    }

    return pncErrorCode === start
  })

const getPncExceptionFromMessage = (
  pncErrorMessage: string,
  pncErrorRanges: PncErrorRangesForException[],
  defaultException: ExceptionCode
): PncException => {
  const pncErrorCode = pncErrorMessage.substring(0, 5)

  for (const { code, ranges } of pncErrorRanges) {
    if (inPncErrorRange(pncErrorCode, ranges)) {
      return { code, path: errorPaths.case.asn, message: pncErrorMessage }
    }
  }

  return { code: defaultException, path: errorPaths.case.asn, message: pncErrorMessage }
}

export default getPncExceptionFromMessage
