import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { ComparisonData } from "../../types/ComparisonData"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

import { checkIntentionalDifferenceForPhases } from "./index"

const convictionDateMatching = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    if (!("exceptions" in expectedMatchingSummary)) {
      return false
    }

    const bichardRaisesHo100310 = expectedMatchingSummary.exceptions.some(
      (exception) => exception.code === ExceptionCode.HO100310
    )
    const bichardRaisesHo100332 = expectedMatchingSummary.exceptions.some(
      (exception) => exception.code === ExceptionCode.HO100332
    )

    const coreMatches = "offences" in actualMatchingSummary

    const offenceIndices = expectedMatchingSummary.exceptions.map((e) => e.path[5])

    const exceptionOffences = expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
      (_, index) => offenceIndices.includes(index)
    )

    const exceptionOffencesHaveConvictionDate = exceptionOffences.some((offence) => offence.ConvictionDate)

    return (bichardRaisesHo100310 || bichardRaisesHo100332) && coreMatches && exceptionOffencesHaveConvictionDate
  })

export default convictionDateMatching
