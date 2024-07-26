import type { Operation } from "../../../../types/PncUpdateDataset"
import extractRemandCcrs from "./extractRemandCcrs"

const filterDisposalsAddedInCourt = (operations: Operation[]): Operation[] => {
  const adjPreJudgementRemandCcrs = extractRemandCcrs(operations, true)

  const disposalsAddedInCourt = operations.filter(
    (o) => o.code === "DISARR" && o.addedByTheCourt && adjPreJudgementRemandCcrs.has(o.data?.courtCaseReference)
  )
  const otherOperations = operations.filter((o) => o.code !== "DISARR" || !o.addedByTheCourt)

  return otherOperations.concat(disposalsAddedInCourt)
}

export default filterDisposalsAddedInCourt
