import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import ResultClass from "@moj-bichard7/common/types/ResultClass"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import checkRccSegmentApplicability, { RccSegmentApplicability } from "../../lib/checkRccSegmentApplicability"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import hasUnmatchedPoliceOffences from "../lib/hasUnmatchedPoliceOffences"
import checkResultClassExceptions from "./checkResultClassExceptions"

const HO200108: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const fixedPenalty = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const allResultsOnPnc = areAllResultsOnPnc(aho)

  if (fixedPenalty) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    const courtCaseReference = offence?.CourtCaseReferenceNumber || undefined

    if (
      result.PNCAdjudicationExists ||
      (!allResultsOnPnc && hasUnmatchedPoliceOffences(aho, courtCaseReference) && !offence.AddedByTheCourt)
    ) {
      return
    }

    if (
      result.ResultClass &&
      [ResultClass.ADJOURNMENT_WITH_JUDGEMENT, ResultClass.JUDGEMENT_WITH_FINAL_RESULT].includes(result.ResultClass) &&
      result.PNCDisposalType === 2060 &&
      checkRccSegmentApplicability(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence,
        courtCaseReference
      ) === RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
    ) {
      const exception = {
        code: ExceptionCode.HO200108,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      }
      exceptions.push(exception)
    }
  })

  return exceptions
}

export default HO200108
