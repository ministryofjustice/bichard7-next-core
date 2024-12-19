import type { Hearing, Result } from "../../../../types/AnnotatedHearingOutcome"

import isDatedWarrantIssued from "../../../../lib/isDatedWarrantIssued"
import isUndatedWarrantIssued from "../../../../lib/isUndatedWarrantIssued"

const FIRST_INSTANCE_QUALIFIER = "LE"
const FAILED_TO_APPEAR = "*****FAILED TO APPEAR*****"
const FIRST_INSTANCE_UNDATED_WARRANT_ISSUED = "*****1ST INSTANCE WARRANT ISSUED*****"
const FIRST_INSTANCE_DATED_WARRANT_ISSUED = "*****1ST INSTANCE DATED WARRANT ISSUED*****"
const FAILED_TO_APPEAR_DATED_WARRANT_ISSUED = "***** FTA DATED WARRANT *****"

const getCourtHouseName = (hearing: Hearing, results: Result[]): string | undefined => {
  const hasFirstInstanceQualifier = results.some((result) =>
    result.ResultQualifierVariable.some((qualifier) => qualifier.Code === FIRST_INSTANCE_QUALIFIER)
  )

  if (isUndatedWarrantIssued(results[0].CJSresultCode)) {
    return hasFirstInstanceQualifier ? FIRST_INSTANCE_UNDATED_WARRANT_ISSUED : FAILED_TO_APPEAR
  }

  if (isDatedWarrantIssued(results[0].CJSresultCode)) {
    return hasFirstInstanceQualifier ? FIRST_INSTANCE_DATED_WARRANT_ISSUED : FAILED_TO_APPEAR_DATED_WARRANT_ISSUED
  }

  return hearing.CourtHouseName
}

export default getCourtHouseName
