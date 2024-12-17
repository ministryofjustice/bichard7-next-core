import isDatedWarrantIssued from "../../../../lib/isDatedWarrantIssued"
import isUndatedWarrantIssued from "../../../../lib/isUndatedWarrantIssued"
import { Hearing, Result } from "../../../../types/AnnotatedHearingOutcome"

const FIRST_INSTANCE_QUALIFIER = "LE"
const FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE = "*****1ST INSTANCE WARRANT ISSUED*****"
const FAILED_TO_APPEAR_TEXT = "*****FAILED TO APPEAR*****"
const FAILED_TO_APPEAR_DATED_TEXT_FIRST_INSTANCE = "*****1ST INSTANCE DATED WARRANT ISSUED*****"
const FAILED_TO_APPEAR_DATED_TEXT = "***** FTA DATED WARRANT *****"

const getCourtHouseName = (hearing: Hearing, results: Result[]): string | undefined => {
  const hasFirstInstanceQualifier = results.some((result) =>
    result.ResultQualifierVariable.some((qualifier) => qualifier.Code === FIRST_INSTANCE_QUALIFIER)
  )

  if (isUndatedWarrantIssued(results[0].CJSresultCode)) {
    return hasFirstInstanceQualifier ? FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE : FAILED_TO_APPEAR_TEXT
  }

  if (isDatedWarrantIssued(results[0].CJSresultCode)) {
    return hasFirstInstanceQualifier ? FAILED_TO_APPEAR_DATED_TEXT_FIRST_INSTANCE : FAILED_TO_APPEAR_DATED_TEXT
  }

  return hearing.CourtHouseName
}

export default getCourtHouseName
