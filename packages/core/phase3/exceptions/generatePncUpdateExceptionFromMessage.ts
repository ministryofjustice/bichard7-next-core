import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { PncErrorRangesForException } from "../../lib/exceptions/generatePncExceptionFromMessage"
import type { PncException } from "../../types/Exception"

import generatePncExceptionFromMessage from "../../lib/exceptions/generatePncExceptionFromMessage"

const defaultPncUpdateException = ExceptionCode.HO100402
const pncUpdateErrorRanges: PncErrorRangesForException[] = [
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

const generatePncUpdateExceptionFromMessage = (message: string): PncException =>
  generatePncExceptionFromMessage(message, pncUpdateErrorRanges, defaultPncUpdateException)

export default generatePncUpdateExceptionFromMessage
