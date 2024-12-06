import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import forEachRecordableResult from "../../lib/forEachRecordableResult"

export const maxResultQualifierVariable = 4

const HO200202: ExceptionGenerator = (hearingOutcome: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  forEachRecordableResult(hearingOutcome, (_, offenceIndex, result, resultIndex) => {
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

export default HO200202
