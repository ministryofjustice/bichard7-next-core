import addExceptionsToAho from "../../../../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../../../../phase1/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"

export const maxResultQualifierVariable = 4

const validateResultQualifierVariableCode = (
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
) => {
  const result =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[resultIndex]

  if (!result.ResultQualifierVariable) {
    return
  }

  if (result.ResultQualifierVariable.length <= maxResultQualifierVariable) {
    return
  }

  result.ResultQualifierVariable.forEach((_, qualifierVariableIndex) => {
    addExceptionsToAho(
      aho,
      ExceptionCode.HO200202,
      errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex).Code
    )
  })
}

export default validateResultQualifierVariableCode
