import type { Result } from "../../../types/AnnotatedHearingOutcome"
import type { Operation, OperationData } from "../../../types/PncUpdateDataset"

import ResultClass from "@moj-bichard7/common/types/ResultClass"
import isUndatedWarrantIssued from "../../../lib/isUndatedWarrantIssued"
import { PncOperation } from "../../../types/PncOperation"
import createOperation from "./createOperation"

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
  courtCaseReference: null | string | undefined
): Operation<PncOperation.REMAND> => ({
  ...createOperation(PncOperation.REMAND, generateOperationData(result)),
  courtCaseReference: courtCaseReference ?? undefined,
  isAdjournmentPreJudgement: result.ResultClass === ResultClass.ADJOURNMENT_PRE_JUDGEMENT
})

export default createRemandOperation
