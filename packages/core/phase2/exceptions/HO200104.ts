import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import ResultClass from "../../types/ResultClass"
import checkResultClassExceptions from "./checkResultClassExceptions"
import areAnyPncResults2007 from "../lib/generateOperations/areAnyPncResults2007"
import areAllPncResults2007 from "../lib/areAllPncResults2007"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import { areAllResultsOnPnc } from "../lib/generateOperations/areAllResultsOnPnc"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const resubmitted = isPncUpdateDataset(aho)
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  if (fixedPenalty || resubmitted || areAllResultsOnPnc(aho)) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    if (
      result.PNCAdjudicationExists &&
      ((result.ResultClass === ResultClass.SENTENCE && areAnyPncResults2007(aho, offence)) ||
        result.ResultClass === ResultClass.JUDGEMENT_WITH_FINAL_RESULT) &&
      !areAllPncResults2007(aho, offence?.CourtCaseReferenceNumber || undefined)
    ) {
      exceptions.push({
        code: ExceptionCode.HO200104,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      })
    }
  })

  return exceptions
}

export default generator
