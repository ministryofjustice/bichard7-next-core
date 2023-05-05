import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"

const invalidManualSequenceNumber = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  _: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome
): boolean => {
  const noBichardException = !("exceptions" in expected)
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

  return noBichardException && coreRaisesHo100312 && invalidSequenceNumber
}

export default invalidManualSequenceNumber
