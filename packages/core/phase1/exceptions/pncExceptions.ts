import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { ExceptionGenerator } from "../types/ExceptionGenerator"

type ErrorRange = {
  start: string
  end?: string
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
    ranges: [{ start: "I0013", end: "I0022" }]
  },
  {
    code: ExceptionCode.HO100302,
    ranges: [{ start: "PNCAM" }, { start: "PNCUE" }]
  },
  {
    code: ExceptionCode.HO100313,
    ranges: [{ start: "I0208", end: "I0209" }, { start: "I0212" }, { start: "I0256" }]
  },
  {
    code: ExceptionCode.HO100314,
    ranges: [
      { start: "I0007", end: "I0008" },
      { start: "I0014", end: "I0015" },
      { start: "I0021" },
      { start: "I0023" },
      { start: "I0031", end: "I0036" },
      { start: "I1001", end: "I1041" },
      { start: "I6001", end: "I6002" }
    ]
  },
  {
    code: ExceptionCode.HO100315,
    ranges: [{ start: "I5001", end: "I5999" }]
  }
]

const inErrorRange = (code: string, ranges: ErrorRange[]): boolean =>
  ranges.some(({ start, end }) => {
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
