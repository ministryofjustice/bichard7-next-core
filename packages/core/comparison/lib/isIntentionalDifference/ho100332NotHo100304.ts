import { ExceptionCode } from "../../../types/ExceptionCode"
import getOffenceCode from "../../../phase1/lib/offence/getOffenceCode"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

const ho100332NotHo100304 = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    const bichardRaisesHo100304 =
      "exceptions" in expectedMatchingSummary &&
      expectedMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO100304)
    const coreRaisesHo100332 =
      "exceptions" in actualMatchingSummary &&
      actualMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO100332)

    const offenceMatchesMultipleCases =
      expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some((hoOffence) => {
        const matches = expected.aho.PncQuery?.courtCases?.filter((courtCase) =>
          courtCase.offences.some(
            (pncOffence) =>
              getOffenceCode(hoOffence) === pncOffence.offence.cjsOffenceCode &&
              hoOffence.ActualOffenceStartDate.StartDate.getTime() === pncOffence.offence.startDate.getTime()
          )
        )
        return matches?.length && matches.length > 1
      })

    return bichardRaisesHo100304 && coreRaisesHo100332 && offenceMatchesMultipleCases
  })

export default ho100332NotHo100304
