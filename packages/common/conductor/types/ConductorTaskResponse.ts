import type { TaskResult } from "@io-orkes/conductor-javascript"

type ConductorTaskResponse = Promise<Omit<TaskResult, "workflowInstanceId" | "taskId">>

export default ConductorTaskResponse
