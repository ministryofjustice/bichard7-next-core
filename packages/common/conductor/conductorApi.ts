import type { PromiseResult } from "../types/Result"
import type ConductorConfig from "./ConductorConfig"

export type Task = {
  status: string
  taskType: string
  taskId: string
  correlationId: string
  iteration: number
}

export type Workflow = {
  tasks: Task[]
  workflowId: string
}

const base64 = (input: string): string => Buffer.from(input).toString("base64")

const basicAuthHeaders = (conductorConfig: ConductorConfig) => ({
  Authorization: `Basic ${base64(`${conductorConfig.username}:${conductorConfig.password}`)}`
})

const checkError = (result: Response): Response => {
  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Failed to fetch workflows: ${result.status} ${result.statusText}`)
  }

  return result
}

export const getWorkflowsByCorrelationId = (
  workflowName: string,
  correlationId: string,
  conductorConfig: ConductorConfig
): PromiseResult<Workflow[]> =>
  fetch(`${conductorConfig.url}/api/workflow/${workflowName}/correlated/${correlationId}?includeClosed=true`, {
    headers: basicAuthHeaders(conductorConfig)
  })
    .then(checkError)
    .then((result) => result.json())
    .catch((e) => e as Error)

export const getWaitingTaskForWorkflow = (
  workflowId: string,
  conductorConfig: ConductorConfig,
  iteration?: number
): PromiseResult<Task | undefined> =>
  fetch(`${conductorConfig.url}/api/workflow/${workflowId}`, {
    headers: basicAuthHeaders(conductorConfig)
  })
    .then(checkError)
    .then((result) => result.json())
    .then((json) =>
      (json as Workflow).tasks.find(
        (task: Task) =>
          task.status === "IN_PROGRESS" && task.taskType === "HUMAN" && (!iteration || task.iteration === iteration)
      )
    )
    .catch((e) => e as Error)

export const completeWaitingTask = (
  workflowId: string,
  taskId: string,
  conductorConfig: ConductorConfig,
  outputData: Record<string, unknown> = {}
): PromiseResult<void> =>
  fetch(`${conductorConfig.url}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...basicAuthHeaders(conductorConfig) },
    body: JSON.stringify({ taskId, workflowInstanceId: workflowId, status: "COMPLETED", outputData })
  })
    .then(checkError)
    .then((_) => undefined)
    .catch((e) => e as Error)

export const startWorkflow = (
  name: string,
  input: Record<string, unknown>,
  correlationId: string,
  conductorConfig: ConductorConfig
): PromiseResult<string> =>
  fetch(`${conductorConfig.url}/api/workflow`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...basicAuthHeaders(conductorConfig) },
    body: JSON.stringify({ name, input, correlationId })
  })
    .then(checkError)
    .then((res) => res.text()) // returns workflow ID
    .catch((e) => e as Error)
