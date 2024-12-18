import type { Result } from "../../../../types/AnnotatedHearingOutcome"

import isDatedWarrantIssued from "../../../../lib/isDatedWarrantIssued"
import isUndatedWarrantIssued from "../../../../lib/isUndatedWarrantIssued"
import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../getPncCourtCode"

export const generateCourtNameTypes = (
  psaCourtCode: string,
  remandCourtCode: string,
  courtType: null | string | undefined,
  courtHouseName: string | undefined,
  results: Result[]
): [string, string] => {
  let courtNameType1 = ""
  let courtNameType2 = ""
  const courtHouseNameAndType = `${courtHouseName} ${courtType}`

  if (psaCourtCode === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR) {
    if (!isUndatedWarrantIssued(results[0].CJSresultCode)) {
      courtNameType1 = courtNameType2 = courtHouseNameAndType
    } else {
      courtNameType2 = courtHouseName ?? ""
    }
  }

  if (remandCourtCode === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR) {
    if (!isDatedWarrantIssued(results[0].CJSresultCode)) {
      courtNameType1 ||= courtHouseNameAndType
      courtNameType2 ||= courtHouseNameAndType
    } else {
      courtNameType1 = courtHouseName ?? ""
    }
  }

  return [courtNameType1, courtNameType2] as const
}

export default generateCourtNameTypes
