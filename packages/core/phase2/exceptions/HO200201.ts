import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import errorPaths from "../../lib/exceptions/errorPaths"
import checkResultsMatchingPncDisposalsExceptions from "./checkResultsMatchingPncDisposalsExceptions"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  checkResultsMatchingPncDisposalsExceptions(aho, (result, offenceIndex, resultIndex) => {
    result.ResultQualifierVariable?.forEach((qualifierVariable, qualifierVariableIndex) => {
      if (qualifierVariable.Duration?.DurationType !== undefined) {
        exceptions.push({
          code: ExceptionCode.HO200201,
          path: errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex)
            .DurationType
        })
      }
    })
  })

  return exceptions
}

export default generator
