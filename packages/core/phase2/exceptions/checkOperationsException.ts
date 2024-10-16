import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import { areAllResultsOnPnc } from "../lib/generateOperations/areAllResultsOnPnc"
import type { Operation } from "../../types/PncUpdateDataset"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import { generateOperationsFromOffenceResults } from "../lib/generateOperations/generateOperations"

type CheckExceptionFn = (operations: Operation[]) => void

const checkOperationsException = (aho: AnnotatedHearingOutcome, checkExceptionFn: CheckExceptionFn) => {
  const allResultsOnPnc = areAllResultsOnPnc(aho)
  const isResubmitted = isPncUpdateDataset(aho)

  const operations = generateOperationsFromOffenceResults(aho, allResultsOnPnc, isResubmitted)

  return checkExceptionFn(operations)
}

export default checkOperationsException
