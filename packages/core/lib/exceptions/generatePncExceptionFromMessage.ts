import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/types/ExceptionCode"
import type { PncException } from "@moj-bichard7/common/types/Exception"

import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"

export type PncErrorRangesForException = {
  code: ExceptionCode
  ranges: PncErrorRange[]
}

type PncErrorRange = {
  end?: string
  start: string
}

export const getPncErrorCodeFromMessage = (pncErrorMessage: string) => pncErrorMessage.substring(0, 5)

const inPncErrorRange = (pncErrorCode: string, pncErrorRanges: PncErrorRange[]): boolean =>
  pncErrorRanges.some(({ start, end }) => {
    if (end) {
      return pncErrorCode >= start && pncErrorCode <= end
    }

    return pncErrorCode === start
  })

const generatePncExceptionFromMessage = (
  pncErrorMessage: string,
  pncErrorRanges: PncErrorRangesForException[],
  defaultException: ExceptionCode
): PncException => {
  const pncErrorCode = getPncErrorCodeFromMessage(pncErrorMessage)

  for (const { code, ranges } of pncErrorRanges) {
    if (inPncErrorRange(pncErrorCode, ranges)) {
      return { code, path: errorPaths.case.asn, message: pncErrorMessage }
    }
  }

  return { code: defaultException, path: errorPaths.case.asn, message: pncErrorMessage }
}

export default generatePncExceptionFromMessage
