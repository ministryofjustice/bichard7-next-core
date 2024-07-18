import isAdjournedNoNextHearing from "../../lib/isAdjournedNoNextHearing"
import type { Result } from "../../types/AnnotatedHearingOutcome"
import type { Operation, OperationData } from "../../types/PncUpdateDataset"
import addNewOperationToOperationSetIfNotPresent from "./addNewOperationToOperationSetIfNotPresent"

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

const addRemandOperation = (result: Result, operations: Operation[]) => {
  if (isAdjournedNoNextHearing(result.CJSresultCode)) {
    return
  }

  addNewOperationToOperationSetIfNotPresent("NEWREM", generateNewremData(result), operations)
}

export default addRemandOperation
