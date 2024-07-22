import generateFakeAho from "../../../phase1/tests/helpers/generateFakeAho"
import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../types/ResultClass"
import type { ResultClassHandlerParams } from "../../lib/getOperationSequence/deriveOperationSequence/deriveOperationSequence"

type Params = {
  fixedPenalty: boolean
  operations: Record<string, string>[]
  resubmitted: boolean
  allResultsAlreadyOnPnc: boolean
  offence: Offence
  result: Result
  offenceIndex: number
  resultIndex: number
  oAacDisarrOperations: Record<string, string>[]
  remandCcrs: Set<string>
  adjPreJudgementRemandCcrs: Set<string>
}

const defaultParams: Params = {
  fixedPenalty: false,
  operations: [{ dummy: "Main Operations" }],
  resubmitted: false,
  allResultsAlreadyOnPnc: false,
  offence: { AddedByTheCourt: false, Result: [{ PNCDisposalType: 4000 }], CourtCaseReferenceNumber: "234" } as Offence,
  result: { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCAdjudicationExists: false } as Result,
  offenceIndex: 1,
  resultIndex: 1,
  oAacDisarrOperations: [{ dummy: "OAAC DISARR Operations" }],
  remandCcrs: new Set<string>(),
  adjPreJudgementRemandCcrs: new Set<string>()
}

const generateResultClassHandlerParams = (params: Partial<Params> = defaultParams) => {
  const {
    fixedPenalty,
    operations,
    resubmitted,
    allResultsAlreadyOnPnc,
    offence,
    result,
    offenceIndex,
    resultIndex,
    oAacDisarrOperations,
    remandCcrs,
    adjPreJudgementRemandCcrs
  } = {
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
    operations,
    resubmitted,
    allResultsAlreadyOnPnc,
    offence,
    result,
    offenceIndex,
    resultIndex,
    oAacDisarrOperations,
    remandCcrs,
    adjPreJudgementRemandCcrs
  }) as unknown as ResultClassHandlerParams
}

export default generateResultClassHandlerParams
