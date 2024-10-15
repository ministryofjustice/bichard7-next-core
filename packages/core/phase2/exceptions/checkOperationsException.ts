import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import { areAllResultsOnPnc } from "../lib/generateOperations/areAllResultsOnPnc"
import type { Operation } from "../../types/PncUpdateDataset"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import { generateOperationsFromOffenceResults } from "../lib/generateOperations/generateOperations"

type CheckExceptionFn = (operations: Operation[]) => void

const checkOperationsException = (aho: AnnotatedHearingOutcome, checkExceptionFn: CheckExceptionFn) => {
  const isResubmitted = isPncUpdateDataset(aho)
  const allResultsOnPnc = areAllResultsOnPnc(aho)

  const operations = generateOperationsFromOffenceResults(aho, isResubmitted, allResultsOnPnc)

  return checkExceptionFn(operations)
}

export default checkOperationsException
