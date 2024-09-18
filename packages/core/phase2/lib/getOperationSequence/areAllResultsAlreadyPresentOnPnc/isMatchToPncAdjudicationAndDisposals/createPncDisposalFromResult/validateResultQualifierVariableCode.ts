import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../../lib/exceptions/errorPaths"
import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../../../types/Exception"

export const maxResultQualifierVariable = 4

const validateResultQualifierVariableCode = (
  result: Result,
  offenceIndex: number,
  resultIndex: number
): Exception[] => {
  const raiseHo200202 =
    result.ResultQualifierVariable && result.ResultQualifierVariable.length > maxResultQualifierVariable

  return raiseHo200202
    ? result.ResultQualifierVariable.map((_, qualifierVariableIndex) => ({
        code: ExceptionCode.HO200202,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex).Code
      }))
    : []
}

export default validateResultQualifierVariableCode
