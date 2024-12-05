/* eslint-disable @typescript-eslint/no-explicit-any */

type Action = {
  action?: "complete_task" | "fail_task" | "start_workflow"
  complete_task?: TaskDetails
  expandInlineJSON?: boolean
  fail_task?: TaskDetails
  start_workflow?: StartWorkflow
}

type EventHandlerDef = {
  actions: Array<Action>
  active?: boolean
  condition?: string
  evaluatorType?: string
  event: string
  name: string
}

type StartWorkflow = {
  correlationId?: string
  input?: Record<string, any>
  name?: string
  taskToDomain?: Record<string, string>
  version?: number
}

type TaskDetails = {
  output?: Record<string, any>
  taskId?: string
  taskRefName?: string
  workflowId?: string
}

export default EventHandlerDef
