import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../lib/exceptions/errorPaths"
import addRemandOperation from "../../../addRemandOperation"
import type { ResultClassHandler } from "../deriveOperationSequence"

export const handleAdjournmentPreJudgement: ResultClassHandler = ({
  offenceIndex,
  resultIndex,
  result,
  operations,
  offence,
  remandCcrs,
  adjPreJudgementRemandCcrs
}) => {
  if (result.PNCAdjudicationExists) {
    return { code: ExceptionCode.HO200100, path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass }
  }

  addRemandOperation(result, operations)
  adjPreJudgementRemandCcrs.add(offence?.CourtCaseReferenceNumber)

  if (offence?.CourtCaseReferenceNumber) {
    remandCcrs.add(offence.CourtCaseReferenceNumber)
  }
}
