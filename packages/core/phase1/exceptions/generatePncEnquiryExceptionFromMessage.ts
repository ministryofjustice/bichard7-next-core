import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { ErrorRangeDefinition } from "../../lib/exceptions/getPncExceptionFromMessage"
import type { PncException } from "../../types/Exception"

import errorPaths from "../../lib/exceptions/errorPaths"
import getPncExceptionFromMessage from "../../lib/exceptions/getPncExceptionFromMessage"

const defaultPncUpdateException = ExceptionCode.HO100314
const pncEnquiryErrorRanges: ErrorRangeDefinition[] = [
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

export const isNotFoundError = (message: string): boolean => !!message.match(/^I1008.*ARREST\/SUMMONS REF .* NOT FOUND/)

const generatePncEnquiryExceptionFromMessage = (message: string): PncException => {
  if (isNotFoundError(message)) {
    return { code: ExceptionCode.HO100301, path: errorPaths.case.asn, message }
  }

  return getPncExceptionFromMessage(message, pncEnquiryErrorRanges, defaultPncUpdateException)
}

export default generatePncEnquiryExceptionFromMessage
