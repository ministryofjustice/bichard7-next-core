import { lookupPleaStatusByCjsCode, lookupVerdictByCjsCode } from "../../../../../lib/dataLookup"
import type { Result } from "../../../../../types/AnnotatedHearingOutcome"
import type { NonEmptyArray } from "../../../../../types/NonEmptyArray"
import type { PncAdjudication } from "../../../../../types/PncQueryResult"
import isRecordableResult from "../../../isRecordableResult"
import createPncAdjudication from "./createPncAdjudication"

const createPncAdjudicationFromAho = (results: NonEmptyArray<Result>, hearingDate: Date): PncAdjudication => {
  const recordableResults = results.filter((result) => isRecordableResult(result))
  const resultToExtractValueFrom = recordableResults[0] ?? results[0]
  const numberOfOffencesTIC = results.reduce((acc, result) => (acc += result.NumberOfOffencesTIC ?? 0), 0)

  const disposalType = resultToExtractValueFrom.PNCDisposalType
  const pleaStatusPncCode =
    (resultToExtractValueFrom.PleaStatus && lookupPleaStatusByCjsCode(resultToExtractValueFrom.PleaStatus)?.pncCode) ||
    ""
  let verdict =
    (resultToExtractValueFrom.Verdict && lookupVerdictByCjsCode(resultToExtractValueFrom.Verdict)?.pncCode) || ""

  if (resultToExtractValueFrom.PleaStatus === "ADM" && (verdict === "NON-CONVICTION" || !verdict)) {
    verdict = "GUILTY"
  }

  return createPncAdjudication(disposalType, pleaStatusPncCode, verdict, hearingDate, numberOfOffencesTIC)
}

export default createPncAdjudicationFromAho
