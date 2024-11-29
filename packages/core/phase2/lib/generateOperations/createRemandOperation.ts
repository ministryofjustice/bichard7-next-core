import type { Result } from "../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../types/PncOperation"
import type { Operation, OperationData } from "../../../types/PncUpdateDataset"
import ResultClass from "../../../types/ResultClass"
import createOperation from "./createOperation"
import isUndatedWarrantIssued from "../../../lib/isUndatedWarrantIssued"

const generateOperationData = (result: Result): OperationData<PncOperation.REMAND> | undefined => {
  if (isUndatedWarrantIssued(result.CJSresultCode) || !result.NextResultSourceOrganisation) {
    return undefined
  }

  return {
    nextHearingLocation: { ...result.NextResultSourceOrganisation },
    nextHearingDate: result.NextHearingDate ? new Date(result.NextHearingDate) : undefined
  }
}

const createRemandOperation = (
  result: Result,
  courtCaseReference: string | undefined | null
): Operation<PncOperation.REMAND> => ({
  ...createOperation(PncOperation.REMAND, generateOperationData(result)),
  courtCaseReference: courtCaseReference ?? undefined,
  isAdjournmentPreJudgement: result.ResultClass === ResultClass.ADJOURNMENT_PRE_JUDGEMENT
})

export default createRemandOperation
