import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../../lib/exceptions/errorPaths"
import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../../../types/Exception"

const validateResultQualifierVariableDurationType = (
  result: Result,
  offenceIndex: number,
  resultIndex: number
): Exception[] =>
  result.ResultQualifierVariable?.reduce((exceptions: Exception[], qualifierVariable, qualifierVariableIndex) => {
    if (qualifierVariable.Duration?.DurationType !== undefined) {
      exceptions.push({
        code: ExceptionCode.HO200201,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex)
          .DurationType
      })
    }

    return exceptions
  }, [])

export default validateResultQualifierVariableDurationType
