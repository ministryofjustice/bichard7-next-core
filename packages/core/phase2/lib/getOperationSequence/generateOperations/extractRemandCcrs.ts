import type { Operation } from "../../../../types/PncUpdateDataset"

const extractRemandCcrs = <T extends boolean, K extends T extends false ? string : string | undefined>(
  operations: Operation[],
  isAdjPreJudgement: T
): Set<K> =>
  operations
    .filter((op) => op.code === "NEWREM")
    .reduce((acc, op) => {
      if ((!isAdjPreJudgement && op.courtCaseReference) || (isAdjPreJudgement && op.isAdjournmentPreJudgement)) {
        acc.add(op.courtCaseReference as K)
      }

      return acc
    }, new Set<K>())

export default extractRemandCcrs
