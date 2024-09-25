import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import errorPaths from "../../lib/exceptions/errorPaths"
import { getDisposalTextFromResult } from "../lib/generateOperations/areAllResultsAlreadyPresentOnPnc/isMatchToPncAdjudicationAndDisposals/createPncDisposalFromResult/getDisposalTextFromResult"
import checkResultsMatchingPncDisposalsExceptions from "./checkResultsMatchingPncDisposalsExceptions"
import { maxDisposalTextLength } from "../lib/generateOperations/areAllResultsAlreadyPresentOnPnc/isMatchToPncAdjudicationAndDisposals/createPncDisposalFromResult/createPncDisposalByFirstAndSecondDurations"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
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

export default generator
