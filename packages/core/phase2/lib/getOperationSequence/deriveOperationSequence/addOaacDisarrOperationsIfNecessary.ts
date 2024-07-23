import type { Operation } from "../../../../types/PncUpdateDataset"
import createOperation from "../../createOperation"

const addOaacDisarrOperationsIfNecessary = (
  mainOperations: Operation[],
  oAacDisarrOperations: Operation[],
  adjPreJudgementRemandCcrs: Set<string | undefined>
) => {
  oAacDisarrOperations.forEach((oAacDisarrOperation) => {
    const courtCaseReference =
      oAacDisarrOperation.code === "DISARR" ? oAacDisarrOperation.data?.courtCaseReference : undefined

    if (adjPreJudgementRemandCcrs.has(courtCaseReference)) {
      const data = courtCaseReference ? { courtCaseReference } : undefined
      mainOperations.push(createOperation("DISARR", data))
    }
  })
}

export default addOaacDisarrOperationsIfNecessary
