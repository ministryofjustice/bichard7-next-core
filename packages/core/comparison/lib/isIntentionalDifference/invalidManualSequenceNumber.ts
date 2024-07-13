import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

const invalidManualSequenceNumber = ({ actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    const coreRaisesHo100312 =
      "exceptions" in actualMatchingSummary &&
      actualMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO100312)

    const pncSequenceNumbers = actual.aho.PncQuery?.courtCases
      ?.map((courtCase) => courtCase.offences.map((offence) => offence.offence.sequenceNumber))
      .flat()

    const invalidSequenceNumber = actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
      (offence) =>
        offence.ManualSequenceNumber &&
        !pncSequenceNumbers?.includes(Number(offence.CriminalProsecutionReference.OffenceReasonSequence))
    )

    return coreRaisesHo100312 && invalidSequenceNumber
  })

export default invalidManualSequenceNumber
