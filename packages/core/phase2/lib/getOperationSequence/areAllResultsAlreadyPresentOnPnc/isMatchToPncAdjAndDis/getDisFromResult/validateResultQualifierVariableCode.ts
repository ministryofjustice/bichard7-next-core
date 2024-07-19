import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../../../types/Exception"

export const maxResultQualifierVariable = 4

const validateResultQualifierVariableCode = (
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
): Exception[] => {
  const result =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[resultIndex]

  if (!result.ResultQualifierVariable) {
    return []
  }

  if (result.ResultQualifierVariable.length <= maxResultQualifierVariable) {
    return []
  }

  return result.ResultQualifierVariable.map((_, qualifierVariableIndex) => ({
    code: ExceptionCode.HO200202,
    path: errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex).Code
  }))
}

export default validateResultQualifierVariableCode
