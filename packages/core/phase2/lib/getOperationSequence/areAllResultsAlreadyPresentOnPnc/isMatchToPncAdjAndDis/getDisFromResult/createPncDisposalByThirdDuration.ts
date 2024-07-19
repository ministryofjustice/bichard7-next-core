import type { AnnotatedHearingOutcome, Result } from "../../../../../../types/AnnotatedHearingOutcome"
import DateSpecifiedInResultSequence from "../../../../../../types/DateSpecifiedInResultSequence"
import type { ExceptionResult } from "../../../../../../types/Exception"
import type { PncDisposal } from "../../../../../../types/PncQueryResult"
import createPncDisposal from "./createPncDisposal"
import validateAmountSpecifiedInResult from "./validateAmountSpecifiedInResult"

const getDateSpecifiedInResult = (result: Result) => {
  const startDateSpecifiedInResult = result.DateSpecifiedInResult?.find(
    (date) => date.Sequence === DateSpecifiedInResultSequence.SecondStartDate
  )?.Date
  const endDateSpecifiedInResult = result.DateSpecifiedInResult?.find(
    (date) => date.Sequence === DateSpecifiedInResultSequence.SecondEndDate
  )?.Date

  return startDateSpecifiedInResult ?? endDateSpecifiedInResult
}

const createPncDisposalByThirdDuration = (
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number,
  validatedDisposalText: string | undefined
): ExceptionResult<PncDisposal | undefined> => {
  const result =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[resultIndex]
  if (!result.Duration?.[2]) {
    return { value: undefined, exceptions: [] }
  }

  const thirdDuration = result.Duration[2]
  const { value: thirdAmountSpecifiedInResult, exceptions } = validateAmountSpecifiedInResult(
    aho,
    offenceIndex,
    resultIndex,
    2
  )

  const disposal = createPncDisposal(
    result.PNCDisposalType,
    thirdDuration.DurationUnit,
    thirdDuration.DurationLength,
    undefined,
    undefined,
    getDateSpecifiedInResult(result),
    thirdAmountSpecifiedInResult,
    result.ResultQualifierVariable.map((res) => res.Code),
    validatedDisposalText
  )

  return { value: disposal, exceptions }
}

export default createPncDisposalByThirdDuration
