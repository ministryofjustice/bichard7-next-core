import isAdjournedNoNextHearing from "../../lib/isAdjournedNoNextHearing"
import type { Result } from "../../types/AnnotatedHearingOutcome"
import type { Operation, OperationData } from "../../types/PncUpdateDataset"
import ResultClass from "../../types/ResultClass"
import addNewOperationToOperationSetIfNotPresent from "./addNewOperationToOperationSetIfNotPresent"

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

const addRemandOperation = (result: Result, courtCaseReference: string | undefined | null, operations: Operation[]) => {
  if (isAdjournedNoNextHearing(result.CJSresultCode)) {
    return
  }

  addNewOperationToOperationSetIfNotPresent(
    "NEWREM",
    generateNewremData(result, courtCaseReference ?? undefined),
    operations
  )
}

export default addRemandOperation
