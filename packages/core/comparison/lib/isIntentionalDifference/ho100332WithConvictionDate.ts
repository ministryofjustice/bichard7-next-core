import { ExceptionCode } from "../../../types/ExceptionCode"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"

// Core uses Conviction Date on the incoming offences to disambiguate between offence matches. This means it
// is able to match in some cases where Bichard can't.

const ho100332WithConvictionDate = ({ expected, actual }: ComparisonData): boolean => {
  const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
  const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

  if (!("exceptions" in expectedMatchingSummary) || "exceptions" in actualMatchingSummary) {
    return false
  }

  const ho100332s = expectedMatchingSummary.exceptions.filter((exception) => exception.code === ExceptionCode.HO100332)
  const bichardRaisesHo100332 = ho100332s.length > 0

  const coreMatches = !("exceptions" in actualMatchingSummary)

  const offenceIndices = ho100332s.map((e) => e.path[5])

  const exceptionOffences = expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (_, index) => offenceIndices.includes(index)
  )

  const ho100332HasConvictionDate = exceptionOffences.some((hoOffence) => !!hoOffence.ConvictionDate)

  return bichardRaisesHo100332 && coreMatches && ho100332HasConvictionDate
}

export default ho100332WithConvictionDate
