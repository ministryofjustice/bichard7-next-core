import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../../phase1/lib/errorPaths"
import type Exception from "../../../../../../phase1/types/Exception"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"

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
