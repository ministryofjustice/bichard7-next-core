import type { Operation } from "../types/PncUpdateDataset"

const sortOperations = (operations: Operation[]): Operation[] =>
  operations.filter((o) => String(o.code) !== "NEWREM").concat(operations.filter((o) => String(o.code) === "NEWREM"))

export default sortOperations
