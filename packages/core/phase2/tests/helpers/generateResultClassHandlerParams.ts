import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import type { ResultClassHandlerParams } from "../../lib/generateOperations/resultClassHandlers/ResultClassHandler"

import generateFakeAho from "../../../phase1/tests/helpers/generateFakeAho"
import ResultClass from "../../../types/ResultClass"

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
  areAllResultsOnPnc: false,
  fixedPenalty: false,
  offence: { AddedByTheCourt: false, CourtCaseReferenceNumber: "234", Result: [{ PNCDisposalType: 4000 }] } as Offence,
  offenceIndex: 1,
  resubmitted: false,
  result: { PNCAdjudicationExists: false, ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT } as Result,
  resultIndex: 1
}

const generateResultClassHandlerParams = (params: Partial<Params> = defaultParams) => {
  const { areAllResultsOnPnc, fixedPenalty, offence, offenceIndex, resubmitted, result, resultIndex } = {
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
    areAllResultsOnPnc,
    offence,
    offenceIndex,
    resubmitted,
    result,
    resultIndex
  }) as unknown as ResultClassHandlerParams
}

export default generateResultClassHandlerParams
