import type { Task as ConductorTask, ConductorWorker, TaskResult } from "@io-orkes/conductor-javascript"

import { z, ZodIssueCode } from "zod"

import type Task from "../types/Task"

import createS3Config from "../../s3/createS3Config"
import getFileFromS3 from "../../s3/getFileFromS3"
import readS3FileTags from "../../s3/readS3FileTags"
import { isError } from "../../types/Result"
import logger from "../../utils/logger"
import { failed, failedTerminal } from "../helpers"

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"

type OriginalHandler = ConductorWorker["execute"]
type Handler<T> = (task: Task<T>) => Promise<Omit<TaskResult, "taskId" | "workflowInstanceId">>
type TaskDataInputData<T> = {
  lockId?: string
  options?: Record<string, unknown>
  s3TaskData: T
  s3TaskDataPath: string
}

const inputDataSchema = z.object({
  lockId: z.string().optional(),
  options: z.record(z.unknown()).optional(),
  s3TaskDataPath: z.string()
})

const lockKey = "lockedByWorkstream"

const formatErrorMessages = (schema: string, error: z.ZodError): string[] =>
  error.issues.map((e) => {
    if (e.code === ZodIssueCode.invalid_type) {
      return `${schema} parse error: Expected ${e.expected} for ${e.path.join(".")}`
    }

    return `${schema} parse error. Schema mismatch`
  })

const s3TaskDataFetcher = <T>(schema: z.ZodSchema, handler: Handler<TaskDataInputData<T>>): OriginalHandler => {
  return async (task: ConductorTask) => {
    const inputParseResult = inputDataSchema.safeParse(task.inputData)
    if (!inputParseResult.success) {
      return failedTerminal(...formatErrorMessages("Input data schema", inputParseResult.error))
    }

    const { lockId, options, s3TaskDataPath } = inputParseResult.data

    if (lockId) {
      const objectTags = await readS3FileTags(s3TaskDataPath, taskDataBucket, s3Config)
      if (isError(objectTags)) {
        logger.error(objectTags)
        return failed(`Could not retrieve object tags from S3: ${s3TaskDataPath}`, objectTags.message)
      }

      if (objectTags[lockKey] && objectTags[lockKey] !== lockId) {
        return failed("Lock ID does not match")
      }
    }

    const taskDataContent = await getFileFromS3(s3TaskDataPath, taskDataBucket, s3Config)
    if (isError(taskDataContent)) {
      logger.error(taskDataContent)
      return failed(`Could not retrieve file from S3: ${s3TaskDataPath}`, taskDataContent.message)
    }

    const s3TaskData = JSON.parse(taskDataContent)
    const parseResult = schema.safeParse(s3TaskData)
    if (parseResult.success) {
      const task: Task<TaskDataInputData<T>> = {
        inputData: {
          lockId,
          options,
          s3TaskData: parseResult.data,
          s3TaskDataPath
        }
      }
      return handler(task)
    }

    return failedTerminal(...formatErrorMessages("S3 data schema", parseResult.error))
  }
}

export default s3TaskDataFetcher
