import type { Result } from "../types/AnnotatedHearingOutcome"
import type { PncAdjudication } from "../types/PncQueryResult"

import createPncAdjudication from "./createPncAdjudication"
import { lookupPleaStatusByCjsCode, lookupVerdictByCjsCode } from "./dataLookup"
import isRecordableResult from "./isRecordableResult"

const createPncAdjudicationFromAho = (results: Result[], hearingDate: Date): PncAdjudication | undefined => {
  const result = results.find(isRecordableResult) ?? results[0]
  if (!result) {
    return undefined
  }

  const numberOfOffencesTIC = results.reduce((acc, result) => (acc += result.NumberOfOffencesTIC ?? 0), 0)

  const pleaStatus = (result.PleaStatus && lookupPleaStatusByCjsCode(result.PleaStatus)?.pncCode) || ""
  let verdict = (result.Verdict && lookupVerdictByCjsCode(result.Verdict)?.pncCode) || ""

  if (result.PleaStatus === "ADM" && (verdict === "NON-CONVICTION" || !verdict)) {
    verdict = "GUILTY"
  }

  return createPncAdjudication(result.PNCDisposalType, pleaStatus, verdict, hearingDate, numberOfOffencesTIC)
}

export default createPncAdjudicationFromAho
