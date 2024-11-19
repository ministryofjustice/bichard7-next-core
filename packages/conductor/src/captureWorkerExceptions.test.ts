import type { ConductorWorker, Task } from "@io-orkes/conductor-javascript"
import { captureWorkerExceptions } from "./captureWorkerExceptions"

describe("captureWorkerExceptions", () => {
  it("should capture unhandled exceptions and fail the workflow", async () => {
    const worker: ConductorWorker = {
      taskDefName: "test_task",
      execute: (_: Task) => {
        throw new Error("Unhandled exception")
      }
    }
    const wrappedWorker = captureWorkerExceptions(worker)
    const result = await wrappedWorker.execute({})
    expect(result).toHaveProperty("status", "FAILED")
    const logMessages = result.logs?.map((l) => l.log)
    expect(logMessages).toHaveLength(2)
    expect(logMessages).toContain("Exception caught in test_task: Unhandled exception")
  })
})
