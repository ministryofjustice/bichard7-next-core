import generateFakeAho from "../../../phase1/tests/helpers/generateFakeAho"
import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../types/ResultClass"
import type { ResultClassHandlerParams } from "../../lib/getOperationSequence/deriveOperationSequence/deriveOperationSequence"

type Params = {
  fixedPenalty: boolean
  operations: Record<string, string>[]
  ccrId: string
  resubmitted: boolean
  allResultsAlreadyOnPnc: boolean
  offence: Offence
  result: Result
  offenceIndex: number
  resultIndex: number
  contains2007Result: boolean
  oAacDisarrOperations: Record<string, string>[]
  remandCcrs: Set<string>
  adjPreJudgementRemandCcrs: Set<string>
}

const defaultParams: Params = {
  fixedPenalty: false,
  operations: [{ dummy: "Main Operations" }],
  ccrId: "234",
  resubmitted: false,
  allResultsAlreadyOnPnc: false,
  offence: { AddedByTheCourt: false } as Offence,
  result: { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCAdjudicationExists: false } as Result,
  offenceIndex: 1,
  resultIndex: 1,
  contains2007Result: true,
  oAacDisarrOperations: [{ dummy: "OAAC DISARR Operations" }],
  remandCcrs: new Set<string>(),
  adjPreJudgementRemandCcrs: new Set<string>()
}

const generateResultClassHandlerParams = (params: Partial<Params> = defaultParams) => {
  const {
    fixedPenalty,
    ccrId,
    operations,
    resubmitted,
    allResultsAlreadyOnPnc,
    offence,
    result,
    offenceIndex,
    resultIndex,
    contains2007Result,
    oAacDisarrOperations,
    remandCcrs,
    adjPreJudgementRemandCcrs
  } = {
    ...defaultParams,
    ...params
  }
  return structuredClone({
    aho: generateFakeAho({
      AnnotatedHearingOutcome: {
        HearingOutcome: { Case: { PenaltyNoticeCaseReferenceNumber: fixedPenalty ? "1" : undefined } }
      }
    }),
    operations,
    ccrId: ccrId,
    resubmitted,
    allResultsAlreadyOnPnc,
    offence,
    result,
    offenceIndex,
    resultIndex,
    contains2007Result,
    oAacDisarrOperations,
    remandCcrs,
    adjPreJudgementRemandCcrs
  }) as unknown as ResultClassHandlerParams
}

export default generateResultClassHandlerParams
