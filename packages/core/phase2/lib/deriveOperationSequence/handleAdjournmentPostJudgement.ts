import addExceptionsToAho from "../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../phase1/lib/errorPaths"
import { ExceptionCode } from "../../../types/ExceptionCode"
import addRemandOperation from "../../addRemandOperation"
import type { ResultClassHandler } from "./deriveOperationSequence"

export const handleAdjournmentPostJudgement: ResultClassHandler = ({
  aho,
  offenceIndex,
  offence,
  resultIndex,
  result,
  adjudicationExists,
  operations,
  ccrId,
  remandCcrs
}) => {
  if (adjudicationExists) {
    addRemandOperation(result, operations)

    if (ccrId) {
      remandCcrs.add(ccrId)
    }
  } else if (!offence.AddedByTheCourt) {
    addExceptionsToAho(aho, ExceptionCode.HO200103, errorPaths.offence(offenceIndex).result(resultIndex).resultClass)
  }
}
