import addExceptionsToAho from "../../../../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../../../../phase1/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../../../../../types/ExceptionCode"

function validateResultQualifierVariableDurationType(
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
) {
  const result =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[resultIndex]

  if (!result.ResultQualifierVariable) {
    return
  }

  result.ResultQualifierVariable.forEach((qualifierVariable, qualifierVariableIndex) => {
    if (qualifierVariable.Duration?.DurationType === undefined) {
      return
    }

    addExceptionsToAho(
      aho,
      ExceptionCode.HO200201,
      errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex).DurationType
    )
  })
}

export default validateResultQualifierVariableDurationType
