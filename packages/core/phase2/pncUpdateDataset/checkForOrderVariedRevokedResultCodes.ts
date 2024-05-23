import type { AnnotatedHearingOutcome, Result } from "../../types/AnnotatedHearingOutcome"

// TODO: Consider removing this function if unknownOrderVariedRevokedResultCodes
// is always going to be empty.
// Check https://github.com/ministryofjustice/bichard7-next/blob/main/bichard-backend/src/main/resources/updateBuilder.properties#L17
const unknownOrderVariedRevokedResultCodes: number[] = []

const checkResult = (result?: Result) => result && unknownOrderVariedRevokedResultCodes.includes(result.CJSresultCode)

const checkForOrderVariedRevokedResultCodes = (aho: AnnotatedHearingOutcome): boolean => {
  const hearingDefendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  return (
    checkResult(hearingDefendant.Result) ||
    hearingDefendant.Offence.some((offence) => offence.Result.some((result) => checkResult(result)))
  )
}

export default checkForOrderVariedRevokedResultCodes
