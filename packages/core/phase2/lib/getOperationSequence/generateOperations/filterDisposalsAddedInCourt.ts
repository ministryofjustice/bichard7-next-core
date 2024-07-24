import type { Operation } from "../../../../types/PncUpdateDataset"
import extractRemandCcrs from "./extractRemandCcrs"

const filterDisposalsAddedInCourt = (operations: Operation[]): Operation[] => {
  const adjPreJudgementRemandCcrs = extractRemandCcrs(operations, true)
  return operations.filter((o) => {
    if (o.code !== "DISARR" || !o.addedByTheCourt) {
      return true
    }

    return adjPreJudgementRemandCcrs.has(o.data?.courtCaseReference)
  })
}

export default filterDisposalsAddedInCourt
