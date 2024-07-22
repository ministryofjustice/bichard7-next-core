import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../lib/exceptions/errorPaths"
import addNewOperationToOperationSetIfNotPresent from "../../../addNewOperationToOperationSetIfNotPresent"
import type { ResultClassHandler } from "../deriveOperationSequence"

export const handleAppealOutcome: ResultClassHandler = ({ result, offence, operations, offenceIndex, resultIndex }) => {
  if (result.PNCAdjudicationExists) {
    const ccrId = offence?.CourtCaseReferenceNumber

    addNewOperationToOperationSetIfNotPresent("APPHRD", ccrId ? { courtCaseReference: ccrId } : undefined, operations)
  } else {
    return { code: ExceptionCode.HO200107, path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass }
  }
}
