import isAdjournedNoNextHearing from "../phase1/lib/result/isAdjournedNoNextHearing"
import type { Result } from "../types/AnnotatedHearingOutcome"
import type { Operation, OperationData } from "../types/PncUpdateDataset"
import addNewOperationToOperationSetIfNotPresent from "./addNewOperationToOperationSetIfNotPresent"
import isDefendantWarrantIssuedResult from "./isDefendantWarrantIssuedResult"

const addRemandOperation = (result: Result, operations: Operation[]) => {
  if (!isAdjournedNoNextHearing(result.CJSresultCode)) {
    const data: OperationData<"NEWREM"> =
      !isDefendantWarrantIssuedResult(result.CJSresultCode) && result.NextResultSourceOrganisation
        ? {
            nextHearingLocation: { ...result.NextResultSourceOrganisation },
            nextHearingDate: result.NextHearingDate ? new Date(result.NextHearingDate) : undefined
          }
        : undefined
    addNewOperationToOperationSetIfNotPresent("NEWREM", data, operations)
  }
}

export default addRemandOperation
