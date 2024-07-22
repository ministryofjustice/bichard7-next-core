import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../lib/exceptions/errorPaths"
import addRemandOperation from "../../../addRemandOperation"
import type { ResultClassHandler } from "../deriveOperationSequence"

export const handleAdjournmentPostJudgement: ResultClassHandler = ({
  offenceIndex,
  offence,
  resultIndex,
  result,
  operations,
  ccrId,
  remandCcrs
}) => {
  if (result.PNCAdjudicationExists) {
    addRemandOperation(result, operations)

    if (ccrId) {
      remandCcrs.add(ccrId)
    }
  } else if (!offence.AddedByTheCourt) {
    return { code: ExceptionCode.HO200103, path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass }
  }
}
