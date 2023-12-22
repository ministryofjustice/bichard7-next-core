import type ConductorConfig from "@moj-bichard7/common/conductor/ConductorConfig"
import {
  completeWaitingTask,
  getWaitingTaskForWorkflow,
  type Workflow
} from "@moj-bichard7/common/conductor/conductorApi"
import logger from "@moj-bichard7/common/utils/logger"

export const completeHumanTask = async (
  { workflowId }: Workflow,
  correlationId: string,
  conductorConfig: ConductorConfig
) => {
  const task = await getWaitingTaskForWorkflow(workflowId, conductorConfig)
  if (!task) {
    throw new Error(`Task not found for workflow id: ${workflowId}`)
  }

  await completeWaitingTask(workflowId, task.taskId, conductorConfig)
  logger.info({ event: "message-forwarder:completed-waiting-task", correlationId })
}
