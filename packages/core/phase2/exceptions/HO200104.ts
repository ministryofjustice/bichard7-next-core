import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import ResultClass from "../../types/ResultClass"
import areAllPncDisposalsWithType from "../lib/areAllPncDisposalsWithType"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import areAnyPncDisposalsWithType from "../lib/areAnyPncDisposalsWithType"
import checkResultClassExceptions from "./checkResultClassExceptions"

const HO200104: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const resubmitted = isPncUpdateDataset(aho)
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  if (fixedPenalty || resubmitted || areAllResultsOnPnc(aho)) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    if (
      result.PNCAdjudicationExists &&
      ((result.ResultClass === ResultClass.SENTENCE && areAnyPncDisposalsWithType(aho, offence, 2007)) ||
        result.ResultClass === ResultClass.JUDGEMENT_WITH_FINAL_RESULT) &&
      !areAllPncDisposalsWithType(aho, offence, 2007)
    ) {
      exceptions.push({
        code: ExceptionCode.HO200104,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      })
    }
  })

  return exceptions
}

export default HO200104
