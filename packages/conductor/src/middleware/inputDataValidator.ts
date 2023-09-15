import type { Task as ConductorTask, ConductorWorker, TaskResult } from "@io-orkes/conductor-javascript"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type { z } from "zod"
import { ZodIssueCode } from "zod"
import type Task from "../Task"

type OriginalHandler = ConductorWorker["execute"]
type Handler<T> = (task: Task<T>) => Promise<Omit<TaskResult, "workflowInstanceId" | "taskId">>

const inputDataValidator = <T>(schema: z.AnyZodObject, handler: Handler<T>): OriginalHandler => {
  return (task: ConductorTask) => {
    const parseResult = schema.safeParse(task.inputData)
    if (parseResult.success) {
      return handler(task as Task<T>)
    }

    const messages = parseResult.error.issues.map((e) => {
      if (e.code === ZodIssueCode.invalid_type) {
        return `InputData error: Expected ${e.expected} for ${e.path.join(".")}`
      }
      return "InputData error. Schema mismatch"
    })

    return Promise.resolve({
      status: "FAILED_WITH_TERMINAL_ERROR",
      logs: messages.map(conductorLog)
    })
  }
}

export default inputDataValidator
