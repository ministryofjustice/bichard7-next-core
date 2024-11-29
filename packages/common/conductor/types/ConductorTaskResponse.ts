import type { TaskResult } from "@io-orkes/conductor-javascript"

type ConductorTaskResponse = Promise<Omit<TaskResult, "taskId" | "workflowInstanceId">>

export default ConductorTaskResponse
