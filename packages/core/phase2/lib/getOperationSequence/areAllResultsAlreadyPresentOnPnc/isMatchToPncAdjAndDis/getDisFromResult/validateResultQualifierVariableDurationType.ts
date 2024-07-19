import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../../../types/Exception"

function validateResultQualifierVariableDurationType(
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
): Exception[] {
  const result =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[resultIndex]

  if (!result.ResultQualifierVariable) {
    return []
  }

  return result.ResultQualifierVariable.map((qualifierVariable, qualifierVariableIndex) => {
    if (qualifierVariable.Duration?.DurationType === undefined) {
      return undefined
    }

    return {
      code: ExceptionCode.HO200201,
      path: errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex)
        .DurationType
    }
  }).filter((exception) => !!exception)
}

export default validateResultQualifierVariableDurationType
