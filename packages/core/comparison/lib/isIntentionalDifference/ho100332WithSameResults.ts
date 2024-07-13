import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"
import hoOffencesAreEqual from "../hoOffencesAreEqual"
import { checkIntentionalDifferenceForPhases } from "./index"

// Bichard sometimes raises a HO100332 for offences that have identical results. Core detects this and
// assigns a match anyway (as it doesn't matter!)

const ho100332WithSameResults = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    if (!("exceptions" in expectedMatchingSummary) || "exceptions" in actualMatchingSummary) {
      return false
    }

    const ho100332s = expectedMatchingSummary.exceptions.filter(
      (exception) => exception.code === ExceptionCode.HO100332
    )
    const bichardRaisesHo100332 = ho100332s.length > 0

    const coreMatches = !("exceptions" in actualMatchingSummary)

    const offenceIndices = ho100332s.map((e) => e.path[5])

    const exceptionOffences = expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
      (_, index) => offenceIndices.includes(index)
    )

    const ho100332OffencesHaveSameResults = exceptionOffences.every((o) => hoOffencesAreEqual(exceptionOffences[0], o))

    return bichardRaisesHo100332 && coreMatches && ho100332OffencesHaveSameResults
  })

export default ho100332WithSameResults
