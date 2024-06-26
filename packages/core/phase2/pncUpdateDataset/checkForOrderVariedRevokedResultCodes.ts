import addExceptionsToAho from "../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../phase1/lib/errorPaths"
import type { AnnotatedHearingOutcome, Result } from "../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../types/ExceptionCode"

// TODO: Consider removing this function if unknownOrderVariedRevokedResultCodes
// is always going to be empty.
// Check https://github.com/ministryofjustice/bichard7-next/blob/main/bichard-backend/src/main/resources/updateBuilder.properties#L17
export const getUnknownOrderVariedRevokedResultCodes = (): number[] => []

const checkResult = (aho: AnnotatedHearingOutcome, offenceIndex: number, resultIndex: number, result?: Result) => {
  const hasOrderVariedRevoked = result && getUnknownOrderVariedRevokedResultCodes().includes(result.CJSresultCode)

  if (hasOrderVariedRevoked) {
    addExceptionsToAho(aho, ExceptionCode.HO200111, errorPaths.offence(offenceIndex).result(resultIndex).cjsResultCode)
  }

  return hasOrderVariedRevoked
}

const checkForOrderVariedRevokedResultCodes = (aho: AnnotatedHearingOutcome): boolean => {
  const hearingDefendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  return hearingDefendant.Offence.some((offence, offenceIndex) =>
    offence.Result.some((result, resultIndex) => checkResult(aho, offenceIndex, resultIndex, result))
  )
}

export default checkForOrderVariedRevokedResultCodes
