import generateFakeAho from "../../../phase1/tests/helpers/generateFakeAho"
import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../types/ResultClass"
import type { ResultClassHandlerParams } from "../../lib/getOperationSequence/deriveOperationSequence/deriveOperationSequence"

type Params = {
  fixedPenalty: boolean
  adjudicationExists: boolean
  operations: Record<string, string>[]
  ccrId: string
  resubmitted: boolean
  allResultsAlreadyOnPnc: boolean
  offence: Offence
  result: Result
  offenceIndex: number
  resultIndex: number
  pncDisposalCode: number
  contains2007Result: boolean
  oAacDisarrOperations: Record<string, string>[]
  remandCcrs: Set<string>
}

const defaultParams: Params = {
  fixedPenalty: false,
  adjudicationExists: false,
  operations: [{ dummy: "Main Operations" }],
  ccrId: "234",
  resubmitted: false,
  allResultsAlreadyOnPnc: false,
  offence: { AddedByTheCourt: false } as Offence,
  result: { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT } as Result,
  offenceIndex: 1,
  resultIndex: 1,
  pncDisposalCode: 4000,
  contains2007Result: true,
  oAacDisarrOperations: [{ dummy: "OAAC DISARR Operations" }],
  remandCcrs: new Set<string>()
}

const generateResultClassHandlerParams = (params: Partial<Params> = defaultParams) => {
  const {
    fixedPenalty,
    ccrId,
    adjudicationExists,
    operations,
    resubmitted,
    allResultsAlreadyOnPnc,
    offence,
    result,
    offenceIndex,
    resultIndex,
    pncDisposalCode,
    contains2007Result,
    oAacDisarrOperations,
    remandCcrs
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
    adjudicationExists,
    operations,
    ccrId: ccrId,
    resubmitted,
    allResultsAlreadyOnPnc,
    offence,
    result,
    offenceIndex,
    resultIndex,
    pncDisposalCode,
    contains2007Result,
    oAacDisarrOperations,
    remandCcrs
  }) as unknown as ResultClassHandlerParams
}

export default generateResultClassHandlerParams
