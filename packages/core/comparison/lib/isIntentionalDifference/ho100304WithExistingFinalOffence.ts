import { ExceptionCode } from "../../../types/ExceptionCode"
import offenceHasFinalResult from "../../../phase1/enrichAho/enrichFunctions/matchOffencesToPnc/offenceHasFinalResult"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

// Often we receive results for the remaining non-final offences in the PNC
// If there are also some final offences, Bichard will raise a HO100304 but Core will match

const ho100304WithExistingFinalOffence = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    const bichardRaisesHo100304 =
      "exceptions" in expectedMatchingSummary &&
      expectedMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO100304)
    const coreMatches = !("exceptions" in actualMatchingSummary)

    if (coreMatches) {
      const matchedCases = actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
        (acc, offence) => {
          acc.add(
            offence.CourtCaseReferenceNumber ||
              actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber!
          )
          return acc
        },
        new Set<string>()
      )

      const allMatchedCasesHaveFinalOrMatchedOffences = Array.from(matchedCases).every((ccr) => {
        const pncCase = actual.aho.PncQuery?.courtCases?.find((courtCase) => courtCase.courtCaseReference === ccr)
        const hoOffencesWithCCR =
          actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
            (hoOffence) =>
              (hoOffence.CourtCaseReferenceNumber ||
                actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber) === ccr
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
  })

export default ho100304WithExistingFinalOffence
