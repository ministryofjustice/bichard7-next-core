import { type Workflow } from "@io-orkes/conductor-javascript"
import type ConductorConfig from "@moj-bichard7/common/conductor/ConductorConfig"
import { getWaitingTaskForWorkflow, getWorkflowByCorrelationId } from "@moj-bichard7/common/conductor/conductorApi"
import promisePoller from "promise-poller"

export const waitForHumanTask = (correlationId: string, config: ConductorConfig) =>
  promisePoller({
    taskFn: async () => {
      const workflow = (await getWorkflowByCorrelationId(correlationId, config)) as Workflow
      if (!workflow || !workflow.workflowId) {
        throw new Error("No workflow found for correlationId: " + correlationId)
      }

      const task = await getWaitingTaskForWorkflow(workflow.workflowId, config)
      if (!task) {
        throw new Error("No waiting task found")
      }

      return task
    },
    retries: 900,
    interval: 100 // milliseconds
  }).catch(() => {
    throw new Error("Could not find workflow")
  })
