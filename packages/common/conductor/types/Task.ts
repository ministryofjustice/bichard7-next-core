/* eslint-disable @typescript-eslint/no-explicit-any */
type Task = {
  taskType?: string
  status?:
    | "IN_PROGRESS"
    | "CANCELED"
    | "FAILED"
    | "FAILED_WITH_TERMINAL_ERROR"
    | "COMPLETED"
    | "COMPLETED_WITH_ERRORS"
    | "SCHEDULED"
    | "TIMED_OUT"
    | "SKIPPED"
  inputData?: Record<string, any>
  referenceTaskName?: string
  retryCount?: number
  seq?: number
  correlationId?: string
  pollCount?: number
  taskDefName?: string
  scheduledTime?: number
  startTime?: number
  endTime?: number
  updateTime?: number
  startDelayInSeconds?: number
  retriedTaskId?: string
  retried?: boolean
  executed?: boolean
  callbackFromWorker?: boolean
  responseTimeoutSeconds?: number
  workflowInstanceId?: string
  workflowType?: string
  taskId?: string
  reasonForIncompletion?: string
  callbackAfterSeconds?: number
  workerId?: string
  outputData?: Record<string, any>
  // workflowTask?: WorkflowTask
  domain?: string
  rateLimitPerFrequency?: number
  rateLimitFrequencyInSeconds?: number
  externalInputPayloadStoragePath?: string
  externalOutputPayloadStoragePath?: string
  workflowPriority?: number
  executionNameSpace?: string
  isolationGroupId?: string
  iteration?: number
  subWorkflowId?: string
  subworkflowChanged?: boolean
  queueWaitTime?: number
  // taskDefinition?: TaskDef
  loopOverTask?: boolean
}

export default Task
