import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import { isPncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import ResultClass from "@moj-bichard7/common/types/ResultClass"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import areAllPoliceDisposalsWithType from "../lib/areAllPoliceDisposalsWithType"
import areAllResultsInPoliceCourtCase from "../lib/areAllResultsInPoliceCourtCase"
import checkResultClassExceptions from "./checkResultClassExceptions"

const HO200101: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const resubmitted = isPncUpdateDataset(aho)
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  if (fixedPenalty || resubmitted || areAllResultsInPoliceCourtCase(aho)) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    if (
      result.PNCAdjudicationExists &&
      result.ResultClass === ResultClass.ADJOURNMENT_WITH_JUDGEMENT &&
      !areAllPoliceDisposalsWithType(aho, offence, 2007)
    ) {
      exceptions.push({
        code: ExceptionCode.HO200101,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      })
    }
  })

  return exceptions
}

export default HO200101
