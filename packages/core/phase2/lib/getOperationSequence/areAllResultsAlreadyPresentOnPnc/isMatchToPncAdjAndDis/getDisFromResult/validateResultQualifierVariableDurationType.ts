import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../../phase1/lib/errorPaths"
import Exception from "../../../../../../phase1/types/Exception"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"

function validateResultQualifierVariableDurationType(
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
): Exception | void {
  const result =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[resultIndex]

  if (!result.ResultQualifierVariable) {
    return
  }

  result.ResultQualifierVariable.forEach((qualifierVariable, qualifierVariableIndex) => {
    if (qualifierVariable.Duration?.DurationType === undefined) {
      return
    }

    return {
      code: ExceptionCode.HO200201,
      path: errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex)
        .DurationType
    }
  })
}

export default validateResultQualifierVariableDurationType
