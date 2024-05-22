import addExceptionsToAho from "../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../phase1/lib/errorPaths"
import { ExceptionCode } from "../../../types/ExceptionCode"
import addRemandOperation from "../../addRemandOperation"
import type { ResultClassHandler } from "./deriveOperationSequence"

export const handleAdjournmentPreJudgement: ResultClassHandler = ({
  adjudicationExists,
  aho,
  offenceIndex,
  resultIndex,
  result,
  operations,
  ccrId,
  remandCcrs,
  adjPreJudgementRemandCcrs
}) => {
  if (adjudicationExists) {
    addExceptionsToAho(aho, ExceptionCode.HO200100, errorPaths.offence(offenceIndex).result(resultIndex).resultClass)
  } else {
    addRemandOperation(result, operations)
    adjPreJudgementRemandCcrs.add(ccrId)
    if (ccrId) {
      remandCcrs.add(ccrId)
    }
  }
}
