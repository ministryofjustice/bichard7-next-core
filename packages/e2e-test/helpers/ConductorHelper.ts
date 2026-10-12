import type { WorkflowSummary } from "@io-orkes/conductor-javascript"

import { createWorkflowExecutor } from "@moj-bichard7/common/conductor/createWorkflowExecutor"
import { delay } from "../utils/puppeteer-utils"

const DEFAULT_WORKFLOW_TIMEOUT_SECONDS = 30
let maxTimeoutSeconds = DEFAULT_WORKFLOW_TIMEOUT_SECONDS

export const setWorkflowTimeoutSeconds = (seconds: number) => {
  maxTimeoutSeconds = seconds
}

export const resetWorkflowTimeout = () => {
  maxTimeoutSeconds = DEFAULT_WORKFLOW_TIMEOUT_SECONDS
}

const findRunningConductorWorkflows = async (): Promise<WorkflowSummary[]> => {
  const workflowExecutor = await createWorkflowExecutor()
  const searchResult = await workflowExecutor.search(0, 100, "status='RUNNING'", "*")

  return searchResult.results || []
}

export const areAllWorkflowsCompleted = async (): Promise<boolean> => {
  const pollIntervalSeconds = 2

  await delay(1)

  const startTime = Date.now()
  const timeoutMs = maxTimeoutSeconds * 1000

  while (Date.now() - startTime < timeoutMs) {
    const runningWorkflows = await findRunningConductorWorkflows()
    if (runningWorkflows.length === 0) {
      return true
    }

    await delay(pollIntervalSeconds)
  }

  return false
}

export const terminateConductorWorkflows = async () => {
  const workflowExecutor = await createWorkflowExecutor()

  while (true) {
    const runningWorkflows = await findRunningConductorWorkflows()
    if (runningWorkflows.length === 0) {
      break
    }

    await Promise.all(
      runningWorkflows.map(async (workflow) => {
        if (workflow.workflowId) {
          await workflowExecutor.terminate(workflow.workflowId, "Termination by test script")
        }
      })
    )
  }
}
