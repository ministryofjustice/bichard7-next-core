import type { Task as ConductorTask, ConductorWorker, TaskResult } from "@io-orkes/conductor-javascript"
import { ZodIssueCode, type z } from "zod"
import createS3Config from "../../s3/createS3Config"
import getFileFromS3 from "../../s3/getFileFromS3"
import { isError } from "../../types/Result"
import logger from "../../utils/logger"
import { failed, failedTerminal } from "../helpers"
import type Task from "../types/Task"

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"

type OriginalHandler = ConductorWorker["execute"]
type Handler<T> = (task: Task<T>) => Promise<Omit<TaskResult, "workflowInstanceId" | "taskId">>
type TaskDataInputData<T> = {
  s3TaskData: T
  s3TaskDataPath: string
}

const s3TaskDataFetcher = <T>(schema: z.ZodSchema, handler: Handler<TaskDataInputData<T>>): OriginalHandler => {
  return async (task: ConductorTask) => {
    if (!task.inputData?.s3TaskDataPath) {
      return failedTerminal("InputData error: Expected string for s3TaskDataPath")
    }

    const { s3TaskDataPath } = task.inputData

    const taskDataContent = await getFileFromS3(s3TaskDataPath, taskDataBucket, s3Config)
    if (isError(taskDataContent)) {
      logger.error(taskDataContent)
      return failed(`Could not retrieve file from S3: ${s3TaskDataPath}`, taskDataContent.message)
    }

    const s3TaskData = JSON.parse(taskDataContent)
    if (!task.inputData) {
      task.inputData = {}
    }
    task.inputData.s3TaskData = s3TaskData as T

    const parseResult = schema.safeParse(s3TaskData)
    if (parseResult.success) {
      return handler(task as Task<TaskDataInputData<T>>)
    }

    const messages = parseResult.error.issues.map((e) => {
      if (e.code === ZodIssueCode.invalid_type) {
        return `S3TaskData error: Expected ${e.expected} for ${e.path.join(".")}`
      }
      return "S3TaskData error. Schema mismatch"
    })
    return failedTerminal(...messages)
  }
}

export default s3TaskDataFetcher
