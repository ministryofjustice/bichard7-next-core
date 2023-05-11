import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import getOffenceCode from "src/lib/offence/getOffenceCode"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"

const ho100332NotHo100304 = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome
): boolean => {
  const bichardRaisesHo100304 =
    "exceptions" in expected && expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100304)
  const coreRaisesHo100332 =
    "exceptions" in actual && actual.exceptions.some((exception) => exception.code === ExceptionCode.HO100332)

  const offenceMatchesMultipleCases =
    expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some((hoOffence) => {
      const matches = expectedAho.PncQuery?.courtCases?.filter((courtCase) =>
        courtCase.offences.some(
          (pncOffence) =>
            getOffenceCode(hoOffence) === pncOffence.offence.cjsOffenceCode &&
            hoOffence.ActualOffenceStartDate.StartDate.getTime() === pncOffence.offence.startDate.getTime()
        )
      )
      return matches?.length && matches.length > 1
    })

  return bichardRaisesHo100304 && coreRaisesHo100332 && offenceMatchesMultipleCases
}

export default ho100332NotHo100304
