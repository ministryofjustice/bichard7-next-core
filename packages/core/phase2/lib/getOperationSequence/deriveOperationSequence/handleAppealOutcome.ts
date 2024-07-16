import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../phase1/lib/errorPaths"
import addNewOperationToOperationSetIfNotPresent from "../../addNewOperationToOperationSetIfNotPresent"
import type { ResultClassHandler } from "./deriveOperationSequence"

export const handleAppealOutcome: ResultClassHandler = ({
  adjudicationExists,
  ccrId,
  operations,
  offenceIndex,
  resultIndex
}) => {
  if (adjudicationExists) {
    addNewOperationToOperationSetIfNotPresent("APPHRD", ccrId ? { courtCaseReference: ccrId } : undefined, operations)
  } else {
    return { code: ExceptionCode.HO200107, path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass }
  }
}
