import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { ComparisonData } from "../../types/ComparisonData"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

import { normaliseCCR } from "../../../phase1/enrichAho/enrichFunctions/matchOffencesToPnc/normaliseCCR"
import { checkIntentionalDifferenceForPhases } from "./index"

const ho100333AndCCRHasLeadingZero = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    const bichardRaisesHo100333 =
      "exceptions" in expectedMatchingSummary &&
      expectedMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO100333)
    const coreMatches = !("exceptions" in actualMatchingSummary)

    const inputCCRs = expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
      (offence) => offence.ManualCourtCaseReference && !!offence.CourtCaseReferenceNumber
    ).map((offence) => offence.CourtCaseReferenceNumber) as string[]

    const pncCCRs = expected.aho.PncQuery?.courtCases?.map((courtCase) => courtCase.courtCaseReference) ?? []

    const allInputCCRsMatch = inputCCRs.every((inputCCR) => pncCCRs?.includes(inputCCR))

    const normalisedInputCCRs = inputCCRs.map((inputCCR) => normaliseCCR(inputCCR))
    const normalisedPNCCCRs = pncCCRs.map((pncCCR) => normaliseCCR(pncCCR))
    const allInputCCRsMatchAfterNormalising = normalisedInputCCRs.every((inputCCR) =>
      normalisedPNCCCRs?.includes(inputCCR)
    )

    return bichardRaisesHo100333 && coreMatches && !allInputCCRsMatch && allInputCCRsMatchAfterNormalising
  })

export default ho100333AndCCRHasLeadingZero
