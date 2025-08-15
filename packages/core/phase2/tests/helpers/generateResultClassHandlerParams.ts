import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import type { ResultClassHandlerParams } from "../../lib/generateOperations/resultClassHandlers/ResultClassHandler"

import ResultClass from "@moj-bichard7/common/types/ResultClass"
import generateFakeAho from "../../../phase1/tests/helpers/generateFakeAho"

type Params = {
  areAllResultsOnPnc: boolean
  fixedPenalty: boolean
  offence: Offence
  offenceIndex: number
  resubmitted: boolean
  result: Result
  resultIndex: number
}

const defaultParams: Params = {
  fixedPenalty: false,
  resubmitted: false,
  areAllResultsOnPnc: false,
  offence: { AddedByTheCourt: false, Result: [{ PNCDisposalType: 4000 }], CourtCaseReferenceNumber: "234" } as Offence,
  result: { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCAdjudicationExists: false } as Result,
  offenceIndex: 1,
  resultIndex: 1
}

const generateResultClassHandlerParams = (params: Partial<Params> = defaultParams) => {
  const { fixedPenalty, resubmitted, areAllResultsOnPnc, offence, result, offenceIndex, resultIndex } = {
    ...defaultParams,
    ...params,
    offence: {
      ...defaultParams.offence,
      ...params.offence
    }
  }

  return structuredClone({
    aho: generateFakeAho({
      AnnotatedHearingOutcome: {
        HearingOutcome: { Case: { PenaltyNoticeCaseReferenceNumber: fixedPenalty ? "1" : undefined } }
      }
    }),
    resubmitted,
    areAllResultsOnPnc,
    offence,
    result,
    offenceIndex,
    resultIndex
  }) as unknown as ResultClassHandlerParams
}

export default generateResultClassHandlerParams
