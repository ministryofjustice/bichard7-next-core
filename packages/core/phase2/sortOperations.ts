import type { Operation } from "../types/PncUpdateDataset"

const sortOperations = (operations: Operation[]): Operation[] =>
  operations.filter((o) => o.code !== "NEWREM").concat(operations.filter((o) => o.code === "NEWREM"))

export default sortOperations
