import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../lib/exceptions/errorPaths"
import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournmentPostJudgement: ResultClassHandler = ({ offenceIndex, offence, resultIndex, result }) => {
  if (result.PNCAdjudicationExists) {
    return createRemandOperation(result, offence?.CourtCaseReferenceNumber)
  } else if (!offence.AddedByTheCourt) {
    const exception = {
      code: ExceptionCode.HO200103,
      path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
    }
    return { operations: [], exceptions: [exception] }
  }

  return { operations: [], exceptions: [] }
}
