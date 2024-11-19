import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"

type ErrorRange = {
  end?: string
  start: string
}

type ErrorRangeDefinition = {
  code: ExceptionCode
  ranges: ErrorRange[]
}

const ho100301 = { code: ExceptionCode.HO100301, path: errorPaths.case.asn }
const ho100314 = { code: ExceptionCode.HO100314, path: errorPaths.case.asn }

const errorRanges: ErrorRangeDefinition[] = [
  {
    code: ExceptionCode.HO100301,
    ranges: [{ end: "I0022", start: "I0013" }]
  },
  {
    code: ExceptionCode.HO100302,
    ranges: [{ start: "PNCAM" }, { start: "PNCUE" }]
  },
  {
    code: ExceptionCode.HO100313,
    ranges: [{ end: "I0209", start: "I0208" }, { start: "I0212" }, { start: "I0256" }]
  },
  {
    code: ExceptionCode.HO100314,
    ranges: [
      { end: "I0008", start: "I0007" },
      { end: "I0015", start: "I0014" },
      { start: "I0021" },
      { start: "I0023" },
      { end: "I0036", start: "I0031" },
      { end: "I1041", start: "I1001" },
      { end: "I6002", start: "I6001" }
    ]
  },
  {
    code: ExceptionCode.HO100315,
    ranges: [{ end: "I5999", start: "I5001" }]
  }
]

const inErrorRange = (code: string, ranges: ErrorRange[]): boolean =>
  ranges.some(({ end, start }) => {
    if (end) {
      return code >= start && code <= end
    }

    return code === start
  })

export const isNotFoundError = (message: string): boolean => !!message.match(/^I1008.*ARREST\/SUMMONS REF .* NOT FOUND/)

const pncExceptions: ExceptionGenerator = (hearingOutcome) => {
  if (typeof hearingOutcome.PncErrorMessage !== "string") {
    return []
  }

  if (isNotFoundError(hearingOutcome.PncErrorMessage)) {
    return [ho100301]
  }

  const errorCode = hearingOutcome.PncErrorMessage?.substring(0, 5)

  for (const { code, ranges } of errorRanges) {
    if (inErrorRange(errorCode, ranges)) {
      return [{ code, path: errorPaths.case.asn }]
    }
  }

  return [ho100314]
}

export default pncExceptions
