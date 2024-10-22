import generateFakeAho from "../../../phase1/tests/helpers/generateFakeAho"
import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../types/ResultClass"
import type { ResultClassHandlerParams } from "../../lib/generateOperations/resultClassHandlers/ResultClassHandler"

type Params = {
  fixedPenalty: boolean
  resubmitted: boolean
  areAllResultsOnPnc: boolean
  offence: Offence
  result: Result
  offenceIndex: number
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
