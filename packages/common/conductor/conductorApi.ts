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

export const getWorkflowByCorrelationId = (
  correlationId: string,
  conductorConfig: ConductorConfig
): PromiseResult<Workflow | undefined> =>
  fetch(`${conductorConfig.url}/api/workflow/bichard_process/correlated/${correlationId}`, {
    headers: basicAuthHeaders(conductorConfig)
  })
    .then((result) => result.json())
    .then((json) => ((json as Workflow[]).length > 0 ? (json as Workflow[])[0] : undefined))
    .catch((e) => e as Error)

export const getWaitingTaskForWorkflow = (
  workflowId: string,
  conductorConfig: ConductorConfig,
  iteration: number = 1
): Promise<Task | undefined> =>
  fetch(`${conductorConfig.url}/api/workflow/${workflowId}`, {
    headers: basicAuthHeaders(conductorConfig)
  })
    .then((result) => result.json())
    .then((json) =>
      (json as Workflow).tasks.find(
        (task: Task) => task.status === "IN_PROGRESS" && task.taskType === "HUMAN" && task.iteration === iteration
      )
    )

export const completeWaitingTask = (
  workflowId: string,
  taskId: string,
  conductorConfig: ConductorConfig,
  outputData: Record<string, unknown> = {}
): Promise<void> =>
  fetch(`${conductorConfig.url}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...basicAuthHeaders(conductorConfig) },
    body: JSON.stringify({ taskId, workflowInstanceId: workflowId, status: "COMPLETED", outputData })
  }).then((_) => {})

export const startWorkflow = (
  name: string,
  input: Record<string, unknown>,
  correlationId: string,
  conductorConfig: ConductorConfig
): Promise<string> =>
  fetch(`${conductorConfig.url}/api/workflow`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...basicAuthHeaders(conductorConfig) },
    body: JSON.stringify({ name, input, correlationId })
  }).then((res) => res.text()) // returns workflow ID
