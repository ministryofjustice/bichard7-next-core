import type { Operation } from "../../types/PncUpdateDataset"
import createOperation from "./createOperation"

describe("addNewOperationToOperationSetIfNotPresent", () => {
  it("adds a new operation to set if not present", () => {
    const operations: Operation[] = []

    createOperation(
      "DISARR",
      {
        courtCaseReference: "court-case-reference"
      },
      operations
    )

    expect(operations).toHaveLength(1)

    const operation = operations[0] as Extract<Operation, { code: "DISARR" }>
    expect(operation.code).toBe("DISARR")
    expect(operation.data?.courtCaseReference).toBe("court-case-reference")
  })

  it("adds operation to set if identical operation exists", () => {
    const operations: Operation[] = [
      { code: "DISARR", status: "NotAttempted", data: { courtCaseReference: "court-case-reference" } }
    ]

    createOperation("DISARR", { courtCaseReference: "court-case-reference" }, operations)

    expect(operations).toHaveLength(2)
  })

  it("will add new operation if no exact match", () => {
    const operations: Operation[] = [
      { code: "DISARR", status: "NotAttempted", data: { courtCaseReference: "court-case-reference" } }
    ]

    createOperation("DISARR", { courtCaseReference: "court-case-reference-2" }, operations)

    expect(operations).toHaveLength(2)
  })
})
