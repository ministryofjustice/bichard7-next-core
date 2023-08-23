import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import { ExceptionCode } from "types/ExceptionCode"
import type { CourtResultMatchingSummary } from "phase1/comparison/types/MatchingComparisonOutput"

const invalidManualSequenceNumber = (
  _: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  __: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  const coreRaisesHo100312 =
    "exceptions" in actual && actual.exceptions.some((exception) => exception.code === ExceptionCode.HO100312)

  const pncSequenceNumbers = actualAho.PncQuery?.courtCases
    ?.map((courtCase) => courtCase.offences.map((offence) => offence.offence.sequenceNumber))
    .flat()

  const invalidSequenceNumber = actualAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (offence) =>
      offence.ManualSequenceNumber &&
      !pncSequenceNumbers?.includes(Number(offence.CriminalProsecutionReference.OffenceReasonSequence))
  )

  return coreRaisesHo100312 && invalidSequenceNumber
}

export default invalidManualSequenceNumber
