import { type Workflow } from "@io-orkes/conductor-javascript"
import promisePoller from "promise-poller"
import type ConductorConfig from "../../conductor/ConductorConfig"
import { getWaitingTaskForWorkflow, getWorkflowByCorrelationId } from "../../conductor/conductorApi"

export const waitForHumanTask = (correlationId: string, config: ConductorConfig, iteration?: number) =>
  promisePoller({
    taskFn: async () => {
      const workflow = (await getWorkflowByCorrelationId(correlationId, config)) as Workflow
      if (!workflow?.workflowId) {
        throw new Error("No workflow found for correlationId: " + correlationId)
      }

      const task = await getWaitingTaskForWorkflow(workflow.workflowId, config, iteration)
      if (!task) {
        throw new Error("No waiting task found")
      }

      return task
    },
    retries: 100,
    interval: 100 // milliseconds
  }).catch(() => {
    throw new Error("Could not find workflow")
  })
