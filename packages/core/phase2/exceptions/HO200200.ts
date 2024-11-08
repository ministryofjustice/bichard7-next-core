import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import { maxDisposalTextLength } from "../lib/createPncDisposalsFromResult/createPncDisposalByFirstAndSecondDurations"
import { getDisposalTextFromResult } from "../lib/getDisposalTextFromResult"
import checkResultsMatchingPncDisposalsExceptions from "./checkResultsMatchingPncDisposalsExceptions"

const HO200200: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  checkResultsMatchingPncDisposalsExceptions(aho, (result, offenceIndex, resultIndex) => {
    if (result.ResultVariableText && getDisposalTextFromResult(result).length > maxDisposalTextLength) {
      exceptions.push({
        code: ExceptionCode.HO200200,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultVariableText
      })
    }
  })

  return exceptions
}

export default HO200200
