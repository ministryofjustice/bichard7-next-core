import isEqual from "lodash.isequal"
import { NewremOperation, Operation } from "../../../../types/PncUpdateDataset"

const isNewremEqual = (operation1: NewremOperation, operation2: NewremOperation): boolean =>
    operation1.code === operation2.code &&
    operation1.status === operation2.status &&
    operation1.data?.nextHearingDate?.getTime() === operation2.data?.nextHearingDate?.getTime() &&
    isEqual(operation1.data?.nextHearingLocation, operation2.data?.nextHearingLocation)
  
const deduplicateOperations = (operations: Operation[]): Operation[] => operations.reduce((acc: Operation[], operation) => {
  const isDuplicate = acc.some((op) =>
    op.code === "NEWREM"
      ? isNewremEqual(op, operation as NewremOperation)
      : isEqual(op, operation)
  )

  if(!isDuplicate) {
    acc.push(operation)
  }

  return acc
}, [])

export default deduplicateOperations
