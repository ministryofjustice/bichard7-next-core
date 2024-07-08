import isAdjournedNoNextHearing from "../../phase1/lib/result/isAdjournedNoNextHearing"
import type { Result } from "../../types/AnnotatedHearingOutcome"
import type { Operation, OperationData } from "../../types/PncUpdateDataset"
import addNewOperationToOperationSetIfNotPresent from "./addNewOperationToOperationSetIfNotPresent"
import isDefendantWarrantIssuedResult from "./isDefendantWarrantIssuedResult"

const generateNewremData = (result: Result): OperationData<"NEWREM"> | undefined => {
  if (isDefendantWarrantIssuedResult(result.CJSresultCode) || !result.NextResultSourceOrganisation) {
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
