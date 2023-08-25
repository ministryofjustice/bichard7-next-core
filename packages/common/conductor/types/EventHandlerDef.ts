/* eslint-disable @typescript-eslint/no-explicit-any */

type StartWorkflow = {
  name?: string
  version?: number
  correlationId?: string
  input?: Record<string, any>
  taskToDomain?: Record<string, string>
}

type TaskDetails = {
  workflowId?: string
  taskRefName?: string
  output?: Record<string, any>
  taskId?: string
}

type Action = {
  action?: "start_workflow" | "complete_task" | "fail_task"
  start_workflow?: StartWorkflow
  complete_task?: TaskDetails
  fail_task?: TaskDetails
  expandInlineJSON?: boolean
}

type EventHandlerDef = {
  name: string
  event: string
  condition?: string
  actions: Array<Action>
  active?: boolean
  evaluatorType?: string
}

export default EventHandlerDef
