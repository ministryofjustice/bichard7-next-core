import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../../../types/ExceptionCode"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

// Previously Bichard would not raise a HO100206 exception for an invalid ASN
// and would continue querying the PNC and getting an error. We've changed this

const invalidASN = (
  _: CourtResultMatchingSummary | null,
  __: CourtResultMatchingSummary | null,
  expectedAho: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  const coreRaisesHo100206 = actualAho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100206)

  const bichardRaisesHo100314 = expectedAho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100314)

  return coreRaisesHo100206 && bichardRaisesHo100314
}

export default invalidASN
