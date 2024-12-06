import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import isRecordableOffence from "../lib/isRecordableOffence"
import isRecordableResult from "../lib/isRecordableResult"

export const maxResultQualifierVariable = 4

const HO200202: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  for (const [
    offenceIndex,
    offence
  ] of aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.entries()) {
    if (!isRecordableOffence(offence)) {
      continue
    }

    for (const [resultIndex, result] of offence.Result.entries()) {
      if (!isRecordableResult(result) || result.ResultQualifierVariable.length <= maxResultQualifierVariable) {
        continue
      }

      exceptions.push(
        ...result.ResultQualifierVariable.map((_, qualifierVariableIndex) => ({
          code: ExceptionCode.HO200202,
          path: errorPaths.offence(offenceIndex).result(resultIndex).resultQualifierVariable(qualifierVariableIndex)
            .Code
        }))
      )
    }
  }

  return exceptions
}

export default HO200202
