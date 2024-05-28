import type { NewremOperation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import getOperationSequence from "../getOperationSequence"
import areNewremTypesEqual from "./areNewremTypesEqual"

const refreshOperationSequence = (pncUpdateDataset: PncUpdateDataset) => {
  const latestOperations = getOperationSequence(pncUpdateDataset, true)
  const latestNewremOperations = latestOperations.filter(
    (operation) => operation.code === "NEWREM"
  ) as NewremOperation[]

  if (pncUpdateDataset.PncOperations.length === 0) {
    pncUpdateDataset.PncOperations = latestOperations
  } else {
    pncUpdateDataset.PncOperations.forEach((existingOperation, existingOperationIndex) => {
      if (existingOperation.code === "NEWREM") {
        if (["NotAttempted", "Failed"].includes(existingOperation.status)) {
          delete pncUpdateDataset.PncOperations[existingOperationIndex]
        } else if (existingOperation.status === "Completed") {
          latestNewremOperations.forEach((latestNewremOperation, latestNewremOperationsIndex) => {
            if (areNewremTypesEqual(existingOperation, latestNewremOperation)) {
              delete latestNewremOperations[latestNewremOperationsIndex]
            }
          })
        }
      }
    })

    pncUpdateDataset.PncOperations = [...pncUpdateDataset.PncOperations, ...latestNewremOperations].filter((o) => o)
  }
}

export default refreshOperationSequence
