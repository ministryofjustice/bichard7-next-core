import { WorkflowExecutor } from "@io-orkes/conductor-javascript"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import { delay } from "../utils/puppeteer-utils"

const findRunningConductorWorkflowIds = async (): Promise<string[]> => {
  const client = await createConductorClient()
  const executor = new WorkflowExecutor(client)
  const searchResult = await executor.search(0, 10000, "status='RUNNING'", "*")

  return searchResult.results?.map((workflow) => workflow.workflowId!) || []
}

export const areAllWorkflowsCompleted = async (): Promise<boolean> => {
  for (let counter = 0; counter < 5; counter++) {
    await delay(counter)

    const runningWorkflowIds = await findRunningConductorWorkflowIds()
    if (runningWorkflowIds.length === 0) {
      return true
    }
  }

  return false
}

export const terminateConductorWorkflows = async () => {
  const client = await createConductorClient()
  const executor = new WorkflowExecutor(client)
  const idsToTerminate = await findRunningConductorWorkflowIds()
  await Promise.all(idsToTerminate.map((id) => executor.terminate(id, "Termination by test script")))
}
