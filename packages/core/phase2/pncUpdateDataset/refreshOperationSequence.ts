import type { NewremOperation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import getOperationSequence from "../getOperationSequence"
import areNewremTypesEqual from "./areNewremTypesEqual"

const refreshOperationSequence = (pncUpdateDataset: PncUpdateDataset) => {
  const latestOperations = getOperationSequence(pncUpdateDataset, true)
  let latestNewremOperations = latestOperations.filter((operation) => operation.code === "NEWREM")

  if (pncUpdateDataset.PncOperations.length === 0) {
    pncUpdateDataset.PncOperations = latestOperations
    return
  }

  pncUpdateDataset.PncOperations = pncUpdateDataset.PncOperations.filter(
    ({ code, status }) => code !== "NEWREM" || status === "Completed"
  )

  latestNewremOperations = latestNewremOperations.filter(
    (newOperation) =>
      !pncUpdateDataset.PncOperations.filter(({ code }) => code === "NEWREM").some((existingOperation) =>
        areNewremTypesEqual(existingOperation as NewremOperation, newOperation)
      )
  )

  pncUpdateDataset.PncOperations = [...pncUpdateDataset.PncOperations, ...latestNewremOperations].filter((o) => o)
}

export default refreshOperationSequence
