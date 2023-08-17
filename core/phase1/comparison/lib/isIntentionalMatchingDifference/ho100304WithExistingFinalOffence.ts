import offenceHasFinalResult from "core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/offenceHasFinalResult"
import type { AnnotatedHearingOutcome } from "core/phase1/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "core/phase1/types/ExceptionCode"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

// Often we receive results for the remaining non-final offences in the PNC
// If there are also some final offences, Bichard will raise a HO100304 but Core will match

const ho100304WithExistingFinalOffence = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  _: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome
): boolean => {
  const bichardRaisesHo100304 =
    "exceptions" in expected && expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100304)
  const coreMatches = !("exceptions" in actual)

  if (coreMatches) {
    const matchedCases = actualAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
      (acc, offence) => {
        acc.add(
          offence.CourtCaseReferenceNumber ||
            actualAho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber!
        )
        return acc
      },
      new Set<string>()
    )

    const allMatchedCasesHaveFinalOrMatchedOffences = Array.from(matchedCases).every((ccr) => {
      const pncCase = actualAho.PncQuery?.courtCases?.find((courtCase) => courtCase.courtCaseReference === ccr)
      const hoOffencesWithCCR = actualAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
        (hoOffence) =>
          (hoOffence.CourtCaseReferenceNumber ||
            actualAho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber) === ccr
      )

      return pncCase?.offences.every((pncOffence) => {
        const hasFinal = offenceHasFinalResult(pncOffence)
        const isMatched = hoOffencesWithCCR.some(
          (hoOffence) =>
            Number(hoOffence.CriminalProsecutionReference.OffenceReasonSequence) === pncOffence.offence.sequenceNumber
        )
        return hasFinal || isMatched
      })
    })

    return bichardRaisesHo100304 && coreMatches && allMatchedCasesHaveFinalOrMatchedOffences
  }

  return false
}

export default ho100304WithExistingFinalOffence
