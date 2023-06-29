import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import { normaliseCCR } from "src/enrichAho/enrichFunctions/matchOffencesToPnc/OffenceMatcher"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"

const ho100333AndCCRHasLeadingZero = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  _: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome
): boolean => {
  const bichardRaisesHo100333 =
    "exceptions" in expected && expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100333)
  const coreMatches = !("exceptions" in actual)

  const inputCCRs = expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (offence) => offence.ManualCourtCaseReference && !!offence.CourtCaseReferenceNumber
  ).map((offence) => offence.CourtCaseReferenceNumber) as string[]

  const pncCCRs = expectedAho.PncQuery?.courtCases?.map((courtCase) => courtCase.courtCaseReference) ?? []

  const allInputCCRsMatch = inputCCRs.every((inputCCR) => pncCCRs?.includes(inputCCR))

  const normalisedInputCCRs = inputCCRs.map((inputCCR) => normaliseCCR(inputCCR))
  const normalisedPNCCCRs = pncCCRs.map((pncCCR) => normaliseCCR(pncCCR))
  const allInputCCRsMatchAfterNormalising = normalisedInputCCRs.every((inputCCR) =>
    normalisedPNCCCRs?.includes(inputCCR)
  )

  return bichardRaisesHo100333 && coreMatches && !allInputCCRsMatch && allInputCCRsMatchAfterNormalising
}

export default ho100333AndCCRHasLeadingZero
