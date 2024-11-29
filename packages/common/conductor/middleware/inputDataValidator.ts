import type { Task as ConductorTask, ConductorWorker, TaskResult } from "@io-orkes/conductor-javascript"
import type { z } from "zod"

import { ZodIssueCode } from "zod"

import type Task from "../types/Task"

import { failedTerminal } from "../helpers"

type Handler<T> = (task: Task<T>) => Promise<Omit<TaskResult, "taskId" | "workflowInstanceId">>
type OriginalHandler = ConductorWorker["execute"]

const inputDataValidator = <T>(schema: z.ZodSchema, handler: Handler<T>): OriginalHandler => {
  return (task: ConductorTask) => {
    const parseResult = schema.safeParse(task.inputData)
    if (parseResult.success) {
      task.inputData = parseResult.data
      return handler(task as Task<T>)
    }

    const messages = parseResult.error.issues.map((e) => {
      if (e.code === ZodIssueCode.invalid_type) {
        return `InputData error: Expected ${e.expected} for ${e.path.join(".")}`
      }

      return "InputData error. Schema mismatch"
    })

    return failedTerminal(...messages)
  }
}

export default inputDataValidator
