import isAdjournedNoNextHearing from "../../../../lib/isAdjournedNoNextHearing"
import type { Result } from "../../../../types/AnnotatedHearingOutcome"
import type { NewremOperation, OperationData } from "../../../../types/PncUpdateDataset"
import ResultClass from "../../../../types/ResultClass"
import createOperation from "./createOperation"
import ExceptionsAndOperations from "./ExceptionsAndOperations"

const DEFENDANT_WARRANT_ISSUED_RESULT_CODES = [4576, 4577]

const generateNewremData = (result: Result): OperationData<"NEWREM"> | undefined => {
  if (DEFENDANT_WARRANT_ISSUED_RESULT_CODES.includes(result.CJSresultCode) || !result.NextResultSourceOrganisation) {
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
): ExceptionsAndOperations => {
  if (isAdjournedNoNextHearing(result.CJSresultCode)) {
    return { operations: [], exceptions: [] }
  }

  const operation = createOperation("NEWREM", generateNewremData(result)) as NewremOperation
  if (operation.data) {
    operation.courtCaseReference = courtCaseReference ?? undefined
    operation.isAdjournmentPreJudgement = result.ResultClass === ResultClass.ADJOURNMENT_PRE_JUDGEMENT
  }

  return {
    operations: [operation],
    exceptions: []
  }
}

export default createRemandOperation
