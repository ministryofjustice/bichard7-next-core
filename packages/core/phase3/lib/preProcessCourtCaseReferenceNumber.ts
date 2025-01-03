import type { Result } from "@moj-bichard7/common/types/Result"

const COURT_CASE_REFERENCE_NUMBER_LENGTH = 15

const preProcessCourtCaseReferenceNumber = (ccr?: string): Result<string> => {
  if (!ccr) {
    return ""
  }

  if (ccr.length !== COURT_CASE_REFERENCE_NUMBER_LENGTH) {
    return new Error(
      `Court Case Reference Number length must be ${COURT_CASE_REFERENCE_NUMBER_LENGTH}, but the length is ${ccr.length}`
    )
  }

  const year = ccr.substring(0, 2)
  const courtCode = ccr.substring(3, 7)
  const sequentialNumber = ccr.substring(8, 14)
  const sequentialNumberWithoutLeadingZeroes =
    sequentialNumber.match(/0*(?<sequentialNumber>.*)/)?.groups?.sequentialNumber
  const checkCharacter = ccr.substring(14)

  return `${year}/${courtCode}/${sequentialNumberWithoutLeadingZeroes}${checkCharacter}`
}

export default preProcessCourtCaseReferenceNumber
