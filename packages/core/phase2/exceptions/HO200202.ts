import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import errorPaths from "../../lib/exceptions/errorPaths"
import checkResultsMatchingPncDisposalsExceptions from "./checkResultsMatchingPncDisposalsExceptions"

export const maxResultQualifierVariable = 4

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  checkResultsMatchingPncDisposalsExceptions(aho, (result, offenceIndex, resultIndex) => {
    if (result.ResultQualifierVariable.length <= maxResultQualifierVariable) {
      return
    }

    exceptions.push(
      ...result.ResultQualifierVariable.map((_, qualifierVariableIndex) => ({
        code: ExceptionCode.HO200202,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex).Code
      }))
    )
  })

  return exceptions
}

export default generator
