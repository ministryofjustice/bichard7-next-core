import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { PncException } from "../../types/Exception"

import errorPaths from "../../lib/exceptions/errorPaths"

type ErrorRange = {
  end?: string
  start: string
}

type ErrorRangeDefinition = {
  code: ExceptionCode
  ranges: ErrorRange[]
}

const errorRanges: ErrorRangeDefinition[] = [
  {
    code: ExceptionCode.HO100401,
    ranges: [
      { start: "I0007", end: "I0008" },
      { start: "I0013", end: "I0015" },
      { start: "I0021", end: "I0023" },
      { start: "I0031", end: "I0036" },
      { start: "I0208", end: "I0209" },
      { start: "I0212" },
      { start: "I0256" }
    ]
  },
  {
    code: ExceptionCode.HO100402,
    ranges: [
      { start: "I0001", end: "I0005" },
      { start: "I0017" },
      { start: "I0024" },
      { start: "I0030" },
      { start: "I1001", end: "I1041" }
    ]
  },
  {
    code: ExceptionCode.HO100403,
    ranges: [{ start: "I5001", end: "I5999" }]
  },
  {
    code: ExceptionCode.HO100404,
    ranges: [{ start: "PNCAM" }, { start: "PNCUE" }, { start: "I6001", end: "I6002" }]
  }
]

const inErrorRange = (code: string, ranges: ErrorRange[]): boolean =>
  ranges.some(({ start, end }) => {
    if (end) {
      return code >= start && code <= end
    }

    return code === start
  })

const generatePncUpdateExceptionFromMessage = (message: string): PncException => {
  const errorCode = message.substring(0, 5)

  for (const { code, ranges } of errorRanges) {
    if (inErrorRange(errorCode, ranges)) {
      return { code, path: errorPaths.case.asn, message }
    }
  }

  return { code: ExceptionCode.HO100402, path: errorPaths.case.asn, message }
}

export default generatePncUpdateExceptionFromMessage
