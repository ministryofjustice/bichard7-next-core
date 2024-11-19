import { PncOperation } from "../../../types/PncOperation"
import type { Operation } from "../../../types/PncUpdateDataset"

const filterDisposalsAddedInCourt = (operations: Operation[]): Operation[] => {
  const adjournmentPreJudgementRemandCcrs = operations
    .filter((operation) => operation.code === PncOperation.REMAND)
    .reduce((adjournmentPreJudgementRemandCcrs, remandOperation) => {
      if (remandOperation.isAdjournmentPreJudgement) {
        adjournmentPreJudgementRemandCcrs.add(remandOperation.courtCaseReference)
      }

      return adjournmentPreJudgementRemandCcrs
    }, new Set<string | undefined>())

  const disposalsAddedInCourt = operations.filter(
    (o) =>
      o.code === PncOperation.NORMAL_DISPOSAL &&
      o.addedByTheCourt &&
      adjournmentPreJudgementRemandCcrs.has(o.data?.courtCaseReference)
  )
  const otherOperations = operations.filter((o) => o.code !== PncOperation.NORMAL_DISPOSAL || !o.addedByTheCourt)

  return otherOperations.concat(disposalsAddedInCourt)
}

export default filterDisposalsAddedInCourt
