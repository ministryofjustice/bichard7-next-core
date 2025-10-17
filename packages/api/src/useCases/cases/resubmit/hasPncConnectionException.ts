import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type { PncException } from "@moj-bichard7/common/types/Exception"
import type { Result } from "@moj-bichard7/common/types/Result"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { extractExceptionsFromXml } from "@moj-bichard7/common/aho/parseAhoXml/index"

export const PNC_ERRORS = [ExceptionCode.HO100302, ExceptionCode.HO100404]

export const hasPncConnectionException = (caseRow: CaseRow): Result<boolean> => {
  const foundPncExceptions = extractExceptionsFromXml(caseRow.annotated_msg).filter(
    (e) => PNC_ERRORS.includes(e.code) && "message" in e
  ) as PncException[]

  if (foundPncExceptions.length === 0) {
    return false
  }

  const regex = new RegExp(/^(PNCAM|PNCUE)/)

  return foundPncExceptions.some((e) => regex.test(e.message))
}
