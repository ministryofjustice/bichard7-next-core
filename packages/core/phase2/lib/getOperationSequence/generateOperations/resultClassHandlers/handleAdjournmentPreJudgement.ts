import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../lib/exceptions/errorPaths"
import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournmentPreJudgement: ResultClassHandler = ({ offenceIndex, resultIndex, result, offence }) => {
  if (result.PNCAdjudicationExists) {
    const exception = {
      code: ExceptionCode.HO200100,
      path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
    }
    return { operations: [], exceptions: [exception] }
  }

  return createRemandOperation(result, offence?.CourtCaseReferenceNumber)
}
