import type { PncException } from "@moj-bichard7/common/types/Exception"

import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import ExceptionCode from "@moj-bichard7/standing-data/types/ExceptionCode"

const defaultEnquiryException = ExceptionCode.HO100314

const exceptions: { [key in ExceptionCode]?: RegExp[] } = {
  [ExceptionCode.HO100301]: [/No matching arrest reports found for asn/i]
}
const exceptionEntries = Object.entries(exceptions) as [ExceptionCode, RegExp[]][]

const generateLedsEnquiryExceptionFromMessage = (message: string): PncException => {
  const exceptionCode =
    exceptionEntries.find(([, patterns]) => patterns.some((pattern) => pattern.test(message)))?.[0] ??
    defaultEnquiryException

  return { code: exceptionCode, path: errorPaths.case.asn, message }
}

export default generateLedsEnquiryExceptionFromMessage
