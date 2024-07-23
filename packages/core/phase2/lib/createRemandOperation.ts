import isAdjournedNoNextHearing from "../../lib/isAdjournedNoNextHearing"
import type { Result } from "../../types/AnnotatedHearingOutcome"
import type { OperationData } from "../../types/PncUpdateDataset"
import ResultClass from "../../types/ResultClass"
import createOperation from "./createOperation"
import { ExceptionsAndOperations } from "./getOperationSequence/deriveOperationSequence/deriveOperationSequence"

const DEFENDANT_WARRANT_ISSUED_RESULT_CODES = [4576, 4577]

const generateNewremData = (
  result: Result,
  courtCaseReference: string | undefined
): OperationData<"NEWREM"> | undefined => {
  if (DEFENDANT_WARRANT_ISSUED_RESULT_CODES.includes(result.CJSresultCode) || !result.NextResultSourceOrganisation) {
    return undefined
  }

  return {
    nextHearingLocation: { ...result.NextResultSourceOrganisation },
    nextHearingDate: result.NextHearingDate ? new Date(result.NextHearingDate) : undefined,
    courtCaseReference,
    isAdjournmentPreJudgement: result.ResultClass === ResultClass.ADJOURNMENT_PRE_JUDGEMENT
  }
}

const createRemandOperation = (
  result: Result,
  courtCaseReference: string | undefined | null
): ExceptionsAndOperations => {
  if (isAdjournedNoNextHearing(result.CJSresultCode)) {
    return { operations: [], exceptions: [] }
  }

  return {
    operations: [createOperation("NEWREM", generateNewremData(result, courtCaseReference ?? undefined))],
    exceptions: []
  }
}

export default createRemandOperation
