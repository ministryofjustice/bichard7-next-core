import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../lib/exceptions/errorPaths"
import createOperation from "../createOperation"
import type { ResultClassHandler } from "./ResultClassHandler"
import { PncOperation } from "../../../../../types/PncOperation"

export const handleAppealOutcome: ResultClassHandler = ({ result, offence, offenceIndex, resultIndex }) => {
  if (result.PNCAdjudicationExists) {
    const ccrId = offence?.CourtCaseReferenceNumber

    return {
      operations: [createOperation(PncOperation.APPEALS_UPDATE, ccrId ? { courtCaseReference: ccrId } : undefined)],
      exceptions: []
    }
  }

  const exception = {
    code: ExceptionCode.HO200107,
    path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
  }
  return { operations: [], exceptions: [exception] }
}
