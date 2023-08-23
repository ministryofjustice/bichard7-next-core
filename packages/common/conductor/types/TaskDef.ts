type TaskDef = {
  ownerApp?: string
  createTime?: number
  updateTime?: number
  createdBy?: string
  updatedBy?: string
  name: string
  description?: string
  retryCount?: number
  timeoutSeconds: number
  inputKeys?: Array<string>
  outputKeys?: Array<string>
  timeoutPolicy?: "RETRY" | "TIME_OUT_WF" | "ALERT_ONLY"
  retryLogic?: "FIXED" | "EXPONENTIAL_BACKOFF" | "LINEAR_BACKOFF"
  retryDelaySeconds?: number
  responseTimeoutSeconds?: number
  concurrentExecLimit?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputTemplate?: Record<string, any>
  rateLimitPerFrequency?: number
  rateLimitFrequencyInSeconds?: number
  isolationGroupId?: string
  executionNameSpace?: string
  ownerEmail?: string
  pollTimeoutSeconds?: number
  backoffScaleFactor?: number
}

export default TaskDef
