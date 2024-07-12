import addExceptionsToAho from "../../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../../phase1/lib/errorPaths"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import addNewOperationToOperationSetIfNotPresent from "../../addNewOperationToOperationSetIfNotPresent"
import type { ResultClassHandler } from "./deriveOperationSequence"

export const handleAppealOutcome: ResultClassHandler = ({
  adjudicationExists,
  ccrId,
  operations,
  aho,
  offenceIndex,
  resultIndex
}) => {
  if (adjudicationExists) {
    addNewOperationToOperationSetIfNotPresent("APPHRD", ccrId ? { courtCaseReference: ccrId } : undefined, operations)
  } else {
    addExceptionsToAho(aho, ExceptionCode.HO200107, errorPaths.offence(offenceIndex).result(resultIndex).resultClass)
  }
}
